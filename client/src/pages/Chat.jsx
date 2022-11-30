import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import './Styles.css';
import io  from "socket.io-client";
import '../components/sidebar.jsx';
import '../components/chatbar.jsx';
import '../components/chatmessage.jsx';
import axios from 'axios';
import SideBar from '../components/sidebar.jsx';
import ChatBar from '../components/chatbar.jsx';
import user from '../configuration';



import { useNavigate } from "react-router-dom";
import './Styles.css';

import '../configuration/index';
import Message from '../components/chatmessage.jsx';


const room = "socket.id";
const socket = io.connect("http://localhost:8080");
function Chat() {
  const navigate = useNavigate();
  const[message,setMessage] = useState("");
  const[response,setResponse] = useState("");
  const[chatId,setChat] = useState(user.activechat);
  const[totalM, settotalM] = useState(0);
  const [viewedMessages,setviewedMessages] = useState([]);
  
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    scrollToBottom()
  }, [viewedMessages]);

  useEffect(()=>{
    if (user.id === ""){
      navigate("/login");
    }
  });  

  useEffect(() => {
    checkMessages();
  }, [chatId]);

  useEffect(() => {
    checkMessages();
    socket.emit("in_chat",chatId);
    socket.off('updated_messages').on("updated_messages", () => {
      console.log("RECEIVED A MESSAGE UPDATE REQUEST");
      checkMessages();
    });
  },[]);

  // Configuration sets header and parameters based on inputted parameters
  const Config = (params) => {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (params) {
      config = {
        ...config,
        params: {
          ...params,
        },
      };
    }
    return config;
  }
  
const sendMessage = event => {
    event.preventDefault();
    var trimmed = message.trim(); 
 
 
    if (trimmed !== ""){
    const sentBy = user.id;
    const body = {message,chatId,sentBy};
   
    axios.post("http://localhost:8080/chat/createMessage",body)
    .then(res=>{
        checkMessages();
    })
    .catch((err)=>{
        console.log(err.response.data.msg);
    });
  }
  setMessage('');
  };
 
const checkMessages = async(total) =>{
  console.log("TOTAL:" + total + "\nUser: " + user.id );
  axios.get(`http://localhost:8080/chat/`, Config({total, chatId }))
  .then((res) => {
   var allMessages = res.data;
    setviewedMessages(allMessages.messages);
    settotalM(allMessages.totalM);
  /**
    if(viewedMessages.length > 0 && viewedMessages[viewedMessages.length-1].message_number > totalM){
      settotalM(viewedMessages[viewedMessages.length-1].message_number);
    }
 */  
   //setMessages({allMessages})
  })
  .catch(function (error) {
    console.log(error);
  });
  
}



const changeChat = async(newId) => {
    user.activechat= newId;
    setChat(newId);
  }

  
  return (
      <div>
       <SideBar goChat = {changeChat}/>
       <ChatBar id = {chatId}/>
      <div className="Chat-header">
      

      <form onSubmit={sendMessage}>
       <div style = {{
        width: 'calc(95% - 120px)',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignContent: 'stretch',
        alignItems: 'center',
        position:'absolute',
        bottom: '2%',
        left:'calc(120px + 1%)',
  }}>
       <input
          type="text"
          style = {{width:'100%'}}
          value={message}
          placeholder="Message..."
          className = "input-container" 
          onChange={(event) => setMessage(event.target.value)}  
        />
         <button className = "Button" type = "submit" style = {{width:'5%'}}>➢</button>
        </div>
      </form>
      {viewedMessages.length > 0 && <div>{viewedMessages[viewedMessages.length-1].message}</div>}
     
     <div className = "message-view">
     <div ref = {messagesEndRef}/>
     {viewedMessages.length > 0 && viewedMessages[viewedMessages.length-1].message_number < totalM && <input type="image" className = "iconImg" src="arrow.png" style = {{transform: 'scaleY(-1'}} alt="Button" onClick = {() => {checkMessages(viewedMessages[viewedMessages.length-1].message_number+19)}}/>}
      {viewedMessages.slice(0).reverse().map((n)=> (
        <Message FullMessage = {n} totalM = {totalM} settotalM = {settotalM}/>    
      ))}
      {viewedMessages.length >= 20 && viewedMessages[0].message_number !== 1 && <input type="image" className = "iconImg" src="arrow.png"  alt="Button" onClick = {() => {checkMessages(viewedMessages[0].message_number)}}/>}
      </div>
      </div>
      </div>
       
      
  );
}

export default Chat;
