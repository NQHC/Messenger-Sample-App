import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css';
import './Styles.css';
import io  from "socket.io-client";
import '../components/sidebar.jsx';
import '../components/chatbar.jsx';
import axios from 'axios';
import SideBar from '../components/sidebar.jsx';
import ChatBar from '../components/chatbar.jsx';
import user from '../configuration';



import { useNavigate } from "react-router-dom";
import './Styles.css';

import '../configuration/index';


const room = "socket.id";
const socket = io.connect("http://localhost:8080");
function Chat() {
  const[message,setMessage] = useState("");
  const[response,setResponse] = useState("");
  const[chatId,setChat] = useState(user.activechat);


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
    setMessage('');
    event.preventDefault();
  
    console.log("Sending :" + message);
      socket.emit("send_message", {
        message,
         roomNumbers: room,
      });
    
  };
 
const checkMessages = () =>{

  
  axios
  .get(`http://localhost:8080/chat/`, Config({ chatId }))
  .then((res) => {
    console.log(JSON.stringify(res.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  
}
const setMessages = ()=>{

}
  const changeChat = (chatId) => {
    setChat(chatId);
    user.activechat= chatId;
  }
  useEffect(() => {
    socket.on("reply_message", ( message2 ) => {
      console.log("WORKING: " + message2);
      setResponse(message2);
    });
  }, []);
  
  return (
      <div>
       <SideBar goChat = {changeChat}/>
       <ChatBar chat = {chatId}/>
  
      <div className="Chat-header">
        <p>
          Connected {chatId}
        </p>
       
      <form onSubmit={sendMessage}>
       <input
          type="text"
          value={message}
          placeholder="Message..."
          className = "input-container" style={{position:'absolute',bottom:'2%',left:'calc(120px + 5%)',width:'calc(90% - 132px)'}}
          onChange={(event) => setMessage(event.target.value)}
          
        />
        <button className = "Button" type = "submit">Send</button>
      </form>
      <button className = "Button" onClick={checkMessages}>Check</button>
      <div className = "replies">
          <p>Response : {response}</p>
      </div>
       </div>
       
        
       </div>
  );
}

export default Chat;
