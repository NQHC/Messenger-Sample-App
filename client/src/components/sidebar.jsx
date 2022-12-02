
import '../pages/Styles.css';
import Link from './sideImage.jsx';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import user from '../configuration/index';

//const data = Array.fromArray({ length: 5 }, (_, index) => index);

export default function SideBar({goChat}){
 
    const navigate = useNavigate();
    const [chatArr,setChats] = useState(user.chats); 
    useEffect(() => {
        checkChat();
        user.socket.off('updated_chats').on("updated_chats", () => { // not implemented
          console.log("Received Remit");
          checkChat();
        });
      },[]);
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
    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }
    const checkChat = async() => {
        await timeout(50);
        console.log("Checking Chat");
        const userId = user.id;
        axios.get(`http://localhost:8080/users/chats`,Config({userId}))
        .then((res) => {
        console.log("Updated Chats :");
        console.log(res.data.chats);
        user.chats = res.data.chats;
        setChats(res.data.chats);
        })
    .catch(function (error) {
    console.log(error);
     });
    }
    const setChatId = (id) => {
        goChat(id);
    }
    
    const goHome = () => {
        user.socket.emit("out_chat",user.activechat);
        navigate("/");
    }
    return (
        <div className ="SideBar" >
      
        <button className ="Button" style = {{width: '5.5rem'}} onClick={goHome}>Home</button>
        {chatArr.map(i => <div key={i}>
        
        <Link chatId = {i}  NavId = {setChatId}/>
        </div>)}
        </div>
    );

}
