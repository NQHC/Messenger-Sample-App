
import '../pages/Styles.css';
import axios from 'axios';

import { useNavigate } from "react-router-dom";
import user from '../configuration/index';
import { useEffect, useState } from 'react';

export default function ChatBar ({id}){
    const navigate = useNavigate();
    const[displayName,setDisplayName] = useState("");
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
      
    
       const checkDisplay = async() => {
       
            const userId = user.id;
            const chatId = id;
        axios.get(`http://localhost:8080/chat/display`,Config({userId,chatId}))
        .then((res) => {
            //console.log(res.data.display);
            setDisplayName(res.data.display);
        })
        .catch(function (error) {
        console.log(error);
     });
    }
    useEffect(() => {
        console.log("checking");
        checkDisplay();
      },[id]);
      
    const deleteChat = () => {   
     
        axios.delete("http://localhost:8080/chat/delChat",{data:{id:id}})
        .then(res=>{
            goHome();
            var i = user.chats.indexOf(id);
            if(i !== -1){
                user.chats.splice(i,1);
            }
        })
        .catch((err)=>{
          console.log("Error:")
            console.log(err.response.data.msg);
        });
       
      };
      const goHome = () => {
        navigate("/");
    }
    return (
        <div style = {Style}>
        <button className = "Button" style = {{position: 'absolute', right:'35px',bottom:'5px',width:'50px',backgroundColor:'red'}} onClick={() =>{deleteChat()}}>➢</button>

        <div style = {{position: 'absolute', left:'155px',bottom:'30%'}}>{displayName}</div>
        </div>
    );

}
const Style = {
    position: 'absolute',
   // left:'120px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '8vh',
    minWidth:'350px',
    width: '100%',
    backgroundColor: '#D2E5D0',
    fontFamily: ' Helvetica, Arial, sans-serif',
    fontSize:'24px',
    overflow:'hidden',
}