
const express = require("express");
const router = express.Router({ mergeParams: true });
require("dotenv/config");
const Chat = require("../schema/Chat");
const Message = require("../schema/Message");
const User = require("../schema/User");
/* GET users listing. */

router.get("/", async (req, res) => {

    const { chatId, total } = req.query; // chat id and total from query
    if (!chatId) { // if chat id was not sent 
        //console.log("Error 1");
        return res.status(400).json({ msg: "Did not send chat Id" });
    }

    await Chat.findById(chatId)
        .then((thisChat) => {
            if (!total) { // if new request set total messages to chat room's total
                currM = thisChat.total_messages;
            }
            else {
                currM = total;
            }
            const quantity = 100;
            Message.find({ // get last 10 messages
                chatId,
                message_number:
                    { $lte: currM, $gt: currM - quantity } // return 10 messages
            }, (err, theseM) => {
                if (err) {
                    return res.status(400).json({ msg: "Start a conversation" });
                }
                var messages = {};
                messages = theseM.map((n => n));
                totalM = thisChat.total_messages;
                res.status(200).json({ messages, totalM });
            })
        })
        .catch((err) => {
            // console.log("Error 3");

            return res.status(400).json({ msg: "No chat instance found" });
        })


});

router.post("/createMessage", async (req, res) => {

    const { message, chatId, sentBy } = req.body;
    await Chat.findById(chatId)
        .then((thisChat) => {
            total = thisChat.total_messages + 1;
            const newMessage = new Message({
                message: message,
                chatId: chatId,
                sentBy: sentBy,
                message_number: total,
            })
            newMessage.save();
            thisChat.total_messages = total;
            thisChat.save();
            var io = req.app.get('socketio');//emitting
            io.to(chatId).emit('updated_messages');
            return res.status(200).json({ msg: "Success" });
        })
        .catch((err) => {
            return res.status(400).json({ msg: "No chat instance found" });
        })
});

router.delete("/delMessage", async (req, res) => {
    const { chatId, message_number } = req.body;

    console.log(chatId + "    " + message_number);
    await Message.deleteMany({ chatId: chatId, message_number: message_number })
        .then((msg) => {
        })
        .catch((err) => {
            console.log("Error encountered with Message: " + err);
        });

    await (Chat.findOneAndUpdate({ _id: chatId, total_messages: { $gt: 0 } }, { $inc: { 'total_messages': -1 } }))
        .catch((err) => {

            console.log("Error with chat: " + err);// check if chat exists and has messages
        }
        )


    await Message.updateMany({ message_number: { $gt: message_number }, chatId: chatId }, { $inc: { 'message_number': -1 } }) // increment count of messages above input down one so they are still in order
        .then(() => {
            var io = req.app.get('socketio');
            io.to(chatId).emit('updated_messages');
            return res.status(200).json({ msg: "Success" });
        })
        .catch((err) => {
            return res.status(400).json({ msg: "Error Encountered with Messages", err });
        })






});
router.post("/editMessage", async (req, res) => {
    const { chatId, message_number, updatedMessage } = req.body;
    if (!chatId || !message_number || !updatedMessage) {
        return res.status(400).json({ msg: "Incorrect Input" });
    }
    await Message.findOneAndUpdate({ chatId: chatId, message_number: message_number }, { message: updatedMessage }) // delete message
        .then(() => {
            var io = req.app.get('socketio');
            io.to(chatId).emit('updated_messages');
            return res.status(200).json({ msg: "Message is now " + updatedMessage });

        })
        .catch((err) => {
            return res.status(400).json({ msg: "Error encountered finding message" });
        });




});

router.post("/createChat", async (req, res) => { // not optimal
    const { user1, user2, } = req.body
    const Users = [user1, user2];
    const newChat = new Chat({
        users: Users,
    })
    var valid = true;
    console.log(user1 + "\n" + user2);

    await User.find({ '_id': { $in: [Users[0], Users[1]] } })
        .then((users) => {
            if (users[0].chats.length > 7 || users[1].chats.length > 7) {
                valid = false;
            }
            else {
                users[0].chats.push(newChat._id);
                users[1].chats.push(newChat._id);
                users[0].save();
                users[1].save();

            }
            //console.log(users[0].chats);

        })
        .catch(err => {
            console.log("User not found");
            valid = false;
            // process.exit(1);
        })

    if (valid) {
        await newChat.save()
            .then(async () => {
                var io = req.app.get('socketio');
                console.log("Emitting Create to " + user1 + " + " + user2);
                await io.to(user1).emit('updated_chats');
                await io.to(user2).emit('updated_chats');
                return res.status(200).json({ msg: "Made Chat" });
            })
            .catch((err) => {
                return res.status(400).json({ msg: "Error Saving" });

            })
    }
    else {
        return res.status(400).json({ msg: "Something went wrong" });
    }




});

router.delete("/delChat", async (req, res) => {
    const { id } = req.body;
    await (Chat.findById(id))
        .then((chat) => {
            User.updateMany({ '_id': { $in: [chat.users[0], chat.users[1]] } },
                { $pullAll: { chats: [id] } }, (err) => {
                if (err) {
                    console.log("User Update Error")
                }
            }
            );
            Message.deleteMany({ chatId: id }, (err) => {
                if (err) {
                    console.log("Message deletetion Error");
                }
            })
            var io = req.app.get('socketio');
            user1 = chat.users[0].toString();
            user2 = chat.users[1].toString();
         //   console.log("Emitting Delete to " + user1 + " + " + user2);
            io.to(user1).emit('updated_chats');
            io.to(user2).emit('updated_chats');
            chat.remove();
            return res.status(201).json({ msg: "Chat deleted", chat });
        })
        .catch(err => {
            console.log("errpr with del");
            return res.status(400).json({ msg: "Error Encountered", err });
        })

})
router.get("/display", async (req, res) => {

    const { chatId, userId } = req.query; // chat id and asking user from query
    if (!chatId) { // if chat id was not sent 
        //console.log("Error 1");
        return res.status(400).json({ msg: "Did not send chat Id" });
    }
    var otherId;
    await Chat.findById(chatId)
        .then(async (thisChat) => {
            if (userId == thisChat.users[1]) {
                otherId = thisChat.users[0];

            }
            else {
                otherId = thisChat.users[1];
            }
            await User.findOne({ _id: otherId })
                .then((user) => {
                    return res.json({
                        display: user.username,
                    })
                })
                .catch((err) => {
                    return res.status(400).json({ msg: "Error" });
                })
        })
        .catch((err) => {
            // console.log("Error 3");
            return res.status(400).json({ msg: "No chat instance found" });
        })


});

module.exports = router;
