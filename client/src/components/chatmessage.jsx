
import '../pages/Styles.css';
import React, { useState, useRef, useEffect} from 'react';
import user from '../configuration';
import axios from 'axios';
export default function Message({FullMessage}){
    const sentByUser = (FullMessage.sentBy === user.id)
    const message_number = FullMessage.message_number;
    const chatId = FullMessage.chatId;
    const message = FullMessage.message;
    const [opMenu,setOpen] = useState(false);
    const [opEdit,setEdit] = useState(false);
    const [updatedMessage,setUpdatedMessage] = useState(message);
    const toggleMenu = () => {
      if (!opEdit){
      setOpen((!opMenu));}
    };
    const toggleEdit = () => {
      setUpdatedMessage(message);
      setOpen(false);
      setEdit((!opEdit));
    };
  const checkOut = React.createRef();
  useEffect(() =>{
      document.addEventListener("mousedown", handleClickOutside);
  })
  const handleClickOutside = (event) => {
    if (
      checkOut.current &&
      !checkOut.current.contains(event.target)
    ) {
      setOpen(false);
      setEdit(false);
      setUpdatedMessage(message);
    }
  };
  
  const deleteMessage = () => {   
    axios.delete("http://localhost:8080/chat/delMessage",{data:{chatId:chatId, message_number:message_number}})
    .then(res=>{
        console.log("Deleted")
    })
    .catch((err)=>{
        console.log(err.response.data.msg);
    });
   
  };
  const editMessage = () => {   

    const body = {chatId,message_number,updatedMessage};
  
    axios.post("http://localhost:8080/chat/editMessage",body)
    .then(res=>{
      setEdit(false);
   
    })
    .catch((err)=>{
        console.log(err.response.data.msg);
    });
   
  };
  
  const handleKeyDown = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`; 
    // In case you have a limitation
     e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  }
   if (sentByUser){
    return (
        <div ref = {checkOut} style = {{alignSelf:'flex-start',position:'relative',display:'inline-block'}}>
        <button style= {StyleFrom} onClick={() => {toggleMenu()}}>
            {!opEdit && <div>{message}</div>}  
            {opEdit && 
              <textarea
              onKeyDown={handleKeyDown}
              value={updatedMessage}
              style = {editStyle}
              onChange={e=>{
              setUpdatedMessage(e.target.value);
              }}/>}
          {opEdit && <input type="image" className = "iconImg" src="arrow.png" style = {{transform: 'rotate(90deg)',position:'absolute',right:'0px',bottom:'2%'}} alt="Button" onClick = {() => {editMessage()}}/>}
        </button>
        {opMenu && 
        <div class = "dropdown">
          <ul>
            <li onClick={() =>{(toggleEdit())}}>Edit</li>
            <li onClick={() =>{deleteMessage()}}>Delete</li>
          </ul>
        </div>
        }
       
      
      </div>
    );
   }
   else{
    return (
        <div style = {{alignSelf:'flex-end'}}>
        <label style= {StyleSent}>  
        Apple
      </label>
      </div>
    );
   }
}
const StyleSent = {
        fontFamily: 'Raleway, sans-serif',
        fontSize: '0.8125rem',
        fontWeight: '400',
        textAlign: 'left',
        margin:'5px',
        color: 'black',
        letterSpacing: '0.01rem',
        fontStyle: 'normal',
        backgroundColor: '#FFD898',
        borderRadius: '0.5rem',
        padding: '1rem 1.5rem',
        borderStyle: 'none',
        maxWidth:'250px',
        display:'inline-block'
}
const StyleFrom = {
    fontFamily: 'Raleway, sans-serif',
    fontSize: '0.8125rem',
    fontWeight: '400',
    textAlign: 'left',
    margin:'5px',
    color: 'black',
    letterSpacing: '0.01rem',
    fontStyle: 'normal',
    backgroundColor: '#B4F8C8',
    borderRadius: '0.5rem',
    padding: '1rem 1.5rem',
    borderStyle: 'none',
    maxWidth:'300px',
    display:'inline-block',
    wordWrap: 'break-word'
} 
const editStyle = {
  fontFamily: 'Raleway, sans-serif',
  
  fontSize: '0.8125rem',
  fontWeight:'400',
  display: "block",
  resize: "none",
  width: "calc(250px)",
  maxWidth: "calc(250px)",
  height : "calc(100% - 2.25rem)",
  maxHeight : "calc(100% - 2.25rem)",
}
