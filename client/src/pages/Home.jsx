import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import './Styles.css';

function Home() {
const navigate = useNavigate();


const goChat = (n) => {
  if (n == 1){
    navigate("/login");
  }
  else{
    navigate("/chat");
  }
}
return (
    <div className = "Page">
        <div className="container">  
        <div className = "center-screen"> 
        <button className="Button" onClick = {goChat}>Chat</button>
        <button className="Button" onClick = {() => goChat(1)}>Login</button>
        </div>
        </div>
       
    </div>
      )
}

/**
const Page = styled.div`
  height: 115vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #332D2D;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #65463E;
  }
  .center-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}
`;

const Button = styled.a`
  text-align: center;
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

export default Home;
