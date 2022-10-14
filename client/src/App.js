import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

import './App.css';
import io  from "socket.io-client";


const room = "socket.id";
const socket = io.connect("http://localhost:8080");
function App() {
  const[message,setMessage] = useState("");
  const[response,setResponse] = useState("");
 
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
        <img src={logo} className="App-logo" alt="logo" />
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
      </header>
      
    </div>
  );
}

export default App;
