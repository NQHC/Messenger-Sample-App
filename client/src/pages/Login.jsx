import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import './Styles.css';

function Login() {
const navigate = useNavigate();


const goChat = () => {
    navigate("/chat");
}
return(

<div className="Page">
    <div className='logbox'>
        <div className = 'title'>Sign In</div>
        
       <input className = "input-container" type="text"
        placeholder = "Username" />
         <input className = "input-container" type="password"
        placeholder = "Password" />
       
     <button className="Button" onClick = {goChat}>Sign In
     </button>
     <div className = "link">
        Create Account
        </div>
     </div>
   </div>
)
}
export default Login;