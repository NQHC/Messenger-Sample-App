import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import { useNavigate } from "react-router-dom";
import './Styles.css';
import axios from 'axios';
import '../configuration/index';
import user from '../configuration/index';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';


function Login() {
const navigate = useNavigate();
let [logMode,setLogMode] = useState("login");
const [email,setEmail] = useState("");
const [firstName,setFirst] = useState("");
const [lastName,setLast] = useState("");
const [phone,setPhone] = useState("");
const [password,setPassword] = useState("");
const [password2,setPassword2] = useState("");

const [Error,setError] = useState("");
const setUser = (User) =>{
    user.id = User.id;
    user.chats = [...User.chats];
    user.email = User.email;
    navigate("/");
}
const clearFields = () =>{
    setEmail("");
    setFirst("");
    setLast("");
    setPhone("");
    setPassword("");
    setPassword2("");
    setError("");
}
const changeLogMode = () => { // change for Sign in to Sign up
    setLogMode(logMode === "login" ? "create" : "login");
}
useEffect(()=> {
    if (user.id !== ""){
        navigate("/");
    }
})
const goChat = () => { // go to Chat
    navigate("/chat");
}
const checkRegister = () =>{
    const body = {email, password}
    axios.post("http://localhost:8080/users/",body)
    .then(res=>{
        const {user} = res.data;
        setUser(user);
        
    })
    .catch((err)=>{
        setError(err.response.data.msg);
        console.log(Error);
    });
}
const checkLogin = () =>{
    const body = {email, password}
    axios.post("http://localhost:8080/users/login",body)
    .then(res=>{
        const {user} = res.data;
        setUser(user);
    })
    .catch((err)=>{
        setError(err.response.data.msg);
        console.log(Error);
    });
}
if (logMode === "login"){
    return(
    <div className="Page">
        <div className='logbox'>
            <div className = 'title'>Sign In</div>
     
        <input className = "input-container" type="email"
            placeholder = "Email" value = {email} onChange={(e) => setEmail(e.target.value)}/>
         <input className = "input-container" type="password" value = {password}
        placeholder = "Password" onChange={(e) => setPassword(e.target.value)}  />
        <div>
         <span style = {{backgroundColor:'#FFCCCB'}}>{Error}</span>
         </div>
        <button className="Button" onClick = {function(){ checkLogin(); setError("")}}>Sign In
        </button>
        <div className = "link" onClick = {function(){ changeLogMode(); clearFields()}}>
            Create Account
            </div>
            <div className = "link">
            Forgot Password?
            </div>
        </div>
    </div>
    )
}
return(
    <div className="Page">
    <div className='logbox'>
        <div className = 'title' style = {{marginBottom:'1px', marginTop:'5px'}} >Sign Up</div>
      
    <input className = "input-container" type="email"
        placeholder = "Email" value = {email} onChange={(e) => setEmail(e.target.value)}  />
    <input className = "input-container" type="text" 
        placeholder = "Phone Number" value = {phone} onChange={(e) => setPhone(e.target.value)}/>
     <input className = "input-container" type="text"
        placeholder = "First Name"  value = {firstName} onChange={(e) => setFirst(e.target.value)} />
    <input className = "input-container" type="text"
        placeholder = "Last Name" value = {lastName} onChange={(e) => setLast(e.target.value)}/>
    <input className = "input-container" type="password"
        placeholder = "Password" onChange={(e) => setPassword(e.target.value)}  />
     <input className = "input-container" type="password"
        placeholder = "Repeat Password" value = {password2} onChange={(e) => setPassword2(e.target.value)}/>
    <div>
    <span style = {{backgroundColor:'#FFCCCB'}}>{Error}</span>
    </div>
    <button className="Button" onClick = {function(){ checkRegister(); setError("")}}>Create Account
    </button>
    <div className = "link" onClick = {function(){ changeLogMode() ;clearFields()}}>
        Already a User?
        </div>
    
    </div>
</div>
    )
}
export default Login;