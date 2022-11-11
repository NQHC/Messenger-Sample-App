import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Styles.css';
import '../components/tags.jsx';
import '../components/sidebar.jsx';

import Tag from '../components/tags.jsx';
import SideBar from '../components/sidebar.jsx';
import user from "../configuration/index.js";
function Home() {
const navigate = useNavigate();


const goChat = (n) => {
    user.activechat = n;
    navigate("/chat");
  
}
const goLogin = () => {
  navigate("/login");
}

return (
  
 
      <div className = "Page">
      <SideBar goChat = {goChat}/>
        <div className="container">  
        <h1>{user.id}</h1>
        <button className="Button" onClick = {goLogin}>Login</button>
     
        <input type="image" className = "imgBut" src="shuffle.png" name="saveForm" onClick={goChat} alt="Button" />
        
        <div className='tagBox' style={{top:'55%',position:"absolute"}}>
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
      
      <img src ="bunny.png" className = "bunny" alt = "a cute bunny"/>
        </div>
       
    </div>
      )
}

export default Home;
// <input type="checkbox" id="tags" className="invisibleCheck"  />
//<label for="tags" className = "tag">Tag</label>
//<div style={{position:'absolute',top:'400px'}}></div>