import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import './App.css';
import './Styles.css';
import io  from "socket.io-client";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const room = "socket.id";
const socket = io.connect("http://localhost:8080");
function Chat() {
  const[message,setMessage] = useState("");
  const[response,setResponse] = useState("");
 

  const navigate = useNavigate();
  const goHome = () => {
      navigate("/");
  }

  const sendMessage = () => {
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
    <div className="App">
      <header className="App-header">
        <p>
          Simple Message App
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
       <div className="box">
       <input
          type="text"
          placeholder="Message..."
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
        />
      </div>
      <div className = "replies">
          <p>Response : {response}</p>
      </div>
      <button className ="Button" onClick = {goHome}>Home</button>
      </header>
       
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
