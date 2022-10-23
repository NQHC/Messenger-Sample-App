import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css';
import './Styles.css';
import io  from "socket.io-client";
import '../components/sidebar.jsx';
import '../components/chatbar.jsx';
import { useNavigate } from "react-router-dom";
import SideBar from '../components/sidebar.jsx';
import ChatBar from '../components/chatbar.jsx';

const room = "socket.id";
const socket = io.connect("http://localhost:8080");
function Chat() {
  const[message,setMessage] = useState("");
  const[response,setResponse] = useState("");
 

  const navigate = useNavigate();
  const goHome = () => {
      navigate("/");
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

  useEffect(() => {
    socket.on("reply_message", ( message2 ) => {
      console.log("WORKING: " + message2);
      setResponse(message2);
    });
  }, []);

  return (
      <div>
       <SideBar/>
       <ChatBar/>
      <div className="Chat-header">
        <p>
          Connected
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
      <div className = "replies">
          <p>Response : {response}</p>
      </div>
       </div>

       </div>
  );
}
/**
const Button = styled.a`
 display: inline-block;
  border-radius: 8px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 10rem;
  background: #32926F;
  color: white;
  border: 2px solid white;
  cursor : pointer;
`;
 */
export default Chat;
