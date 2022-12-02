import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Styles.css';
import '../components/tags.jsx';
import '../components/sidebar.jsx';

import Tag from '../components/tags.jsx';
import SideBar from '../components/sidebar.jsx';
import user from "../configuration/index.js";
import axios from 'axios';

function Home() {
const navigate = useNavigate();

const [QueueStatus,switchStatus] =useState(user.qstat);
const [QueueButton,EnableButton] = useState(true);
const [tags, setTags] = useState([]); 
const QueuePath = {
  Enter: 'shuffle.png',
  Leave : 'shuffleout.png'
}
useEffect(()=>{
  if (user.id === ""){
    navigate("/login");
  }
});  
const goChat = (n) => {
    user.activechat = n;
    navigate("/chat");
 
}

const toggleQueue = () => {
  EnableButton(false);
 // switchStatus(!QueueStatus);
  if (!QueueStatus){
    console.log("Entering Queue");
    updateUserQueue(!QueueStatus);
    const userId = user.id;
    const body = {userId,tags};
   
    axios.post("http://localhost:8080/queue/",body)
    .then(res=>{
       // EnableButton(true);
    })
    .catch((err)=>{
        console.log(err.response.data.msg);
       // EnableButton(true);
    });
  }
  else{
    updateUserQueue(!QueueStatus);
    const id = user.id;
    console.log("Leaving Queue")
    axios.delete("http://localhost:8080/queue/del",{data:{id:id}})
    .then(res=>{
       // EnableButton(true);
    })
    .catch((err)=>{
        console.log(err.response.data.msg);
       // EnableButton(true);
    });
  }
}
const updateUserQueue = (QueueStatus) => {
  const id = user.id;
  const body = {id,QueueStatus}
  axios.put("http://localhost:8080/users/toggleQueue",body)
  .then(res=>{
    
  })
  .catch((err)=>{
      console.log("Error with toggle\n");
      console.log(err.response.data.msg);
  });
}
const goLogin = () => {
  navigate("/login");
}

//        <button className="Button" onClick = {goLogin}>Login</button>
useEffect(() => {
  checkToggle();
  user.socket.off('qToggle').on("qToggle", () => { // not implemented
    checkToggle();
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

const checkToggle = async() => {
  console.log("Checking Toggle");
  const userId = user.id;
  axios.get(`http://localhost:8080/users/queueStatus`,Config({userId}))
  .then((res) => {
  console.log("Updated Toggle :");
  console.log(res.data.queuestatus);
  user.qstat = res.data.queuestatus;
  console.log(QueueStatus);
  if (res.data.queuestatus === false){
    setTags([]);
  }
  switchStatus(res.data.queuestatus);

  EnableButton(true);

  })
.catch(function (error) {
console.log(error);
});
}


return (
  
 
      <div className = "PageN">
      <SideBar goChat = {goChat}/>
        <div className="container">  
        <h1>{user.id}</h1>

     
        <input type="image" disabled = {!QueueButton} className = "imgBut" src={QueuePath[QueueStatus ? 'Leave' : 'Enter']} name="saveForm" onClick={toggleQueue} alt="Button" />
        <div className='tagBox' >
        <Tag TagName="Random Tag" taglist={tags} setTags = {setTags}/>
        <Tag TagName="test" taglist={tags} setTags = {setTags}/>
        <Tag TagName="sample" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Hobbies" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Red" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Blue" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Animals" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Rock Climbing" taglist={tags} setTags = {setTags}/>
        <Tag TagName="swimming" taglist={tags} setTags = {setTags}/>
        <Tag TagName="erie" taglist={tags} setTags = {setTags}/>
        </div>
      
      <img src ="bunny.png" className = {QueueStatus ? "bunnyAni" : 'bunny'} alt = "a cute bunny"/>
        </div>
       
    </div>
      )
}

export default Home;
// <input type="checkbox" id="tags" className="invisibleCheck"  />
//<label for="tags" className = "tag">Tag</label>
//<div style={{position:'absolute',top:'400px'}}></div>