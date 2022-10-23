import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Styles.css';
import '../components/tags.jsx';
import '../components/sidebar.jsx';

import Tag from '../components/tags.jsx';
import SideBar from '../components/sidebar.jsx';
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
      <SideBar/>
        <div className="container">  
         
        <button className="Button" onClick = {goChat}>Chat</button>
        <button className="Button" onClick = {() => goChat(1)}>Login</button>
        <input type="image" className = "imgBut" src="shuffle.png" name="saveForm" onClick={goChat} alt="Button" />
        
        <div style={{position:'absolute',top:'400px'}}>
        <div className='tagBox'>
        <Tag TagName="Random Tag"/>
        <Tag TagName="test"/>
        <Tag TagName="sample"/>
        <Tag TagName="Hobbies"/>
        <Tag TagName="Red"/>
        <Tag TagName="Blue"/>
        <Tag TagName="Animals"/>
        <Tag TagName="Rock Climbing"/>
        <Tag TagName="swimming"/>
        <Tag TagName="erie"/>
        </div>
        </div>
      
      <img src ="bunny.png" className = "bunny" alt = "a cute bunny"/>
        </div>
       
    </div>
      )
}

export default Home;
// <input type="checkbox" id="tags" className="invisibleCheck"  />
//<label for="tags" className = "tag">Tag</label>
//<div style={{position:'absolute',top:'400px'}}></div>