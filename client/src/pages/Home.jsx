import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Styles.css';
import '../components/tags.jsx';
import '../components/sidebar.jsx';

import Tag from '../components/tags.jsx';
import SideBar from '../components/sidebar.jsx';
import user from "../configuration/index.js";
import axios from 'axios';
import classNames from 'classnames';


function Home() {
const navigate = useNavigate();

const [QueueStatus,switchStatus] =useState(user.qstat);
const [QueueButton,EnableButton] = useState(true);
const [tags, setTags] = useState([]); 
const [fetchedTags, setfetchedTags] = useState([]);
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
  if (user.chats.length > 7){
    return;
  }
 // switchStatus(!QueueStatus);
  if (!QueueStatus){
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
const goAccount = () => {
  navigate("/account");
}

//        <button className="Button" onClick = {goLogin}>Login</button>
useEffect(() => {
  if(user.id !== ""){
  checkToggle(1);
  getTags();
  user.socket.off('qToggle').on("qToggle", () => { 
    checkToggle();
  });
}
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

const getTags = async() => {
  axios.get(`http://localhost:8080/queue/tags`,)
  .then((res) => {
    var tagarr = Object.keys(res.data).map(function (i){
      return res.data[i];
    });
    var t = [];
    //Object.keys(tagarr);
    setfetchedTags(tagarr);
   // console.log(tagarr);
  })
  .catch(function (error) {
    console.log("Error Fetching Tags")
  })
}
function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}
const checkToggle = async(a) => {
  if (a && QueueStatus === false){
  }
  else{
  EnableButton(false);
  }
  if(!a){setAnimate(true)
  await timeout(3000);
  };
  setAnimate(false);

  const userId = user.id;
  axios.get(`http://localhost:8080/users/queueStatus`,Config({userId}))
  .then((res) => {
  //console.log("Updated Toggle :");
  //console.log(res.data.queuestatus);
  user.qstat = res.data.queuestatus;
  //console.log(QueueStatus);
  if (res.data.queuestatus === false && !a){
    setTags([]);
  }
  switchStatus(res.data.queuestatus);

  EnableButton(true);

  })
.catch(function (error) {
//console.log(error);
});
}

/**
 *  <Tag TagName="Random Tag" taglist={tags} setTags = {setTags}/>
        <Tag TagName="test" taglist={tags} setTags = {setTags}/>
        <Tag TagName="sample" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Hobbies" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Red" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Blue" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Animals" taglist={tags} setTags = {setTags}/>
        <Tag TagName="Rock Climbing" taglist={tags} setTags = {setTags}/>
        <Tag TagName="swimming" taglist={tags} setTags = {setTags}/>
        <Tag TagName="erie" taglist={tags} setTags = {setTags}/>
 */
const [cTag, setcTag] = useState("");
const addTag = event => {
  event.preventDefault();
  var scrubbed = cTag.toLowerCase().trim(); 
  if (scrubbed !== "" && tags.length < 3 && !tags.includes(scrubbed)){
    tags.push(scrubbed);
  }
setcTag('');
}
const [animate, setAnimate] = useState(false);

return (
  
 
      <div className = "PageN">
      <SideBar goChat = {goChat}/>
        <div className="container">  
        <h1>{user.username}</h1>
        <button className ="Button" style = {{width: '2.5rem', position: 'absolute',top:'0%',right:'0%'}} onClick={goAccount}>⚙️</button>

        <input type="image" disabled = {!QueueButton || (tags.length === 0 && QueueStatus === false)} className = {classNames("imgBut",animate && "flipvert")} src={QueuePath[QueueStatus ? 'Leave' : 'Enter']} name="saveForm" onClick={toggleQueue} alt="Button" />
        <form onSubmit={addTag}>
        <input type="text" maxLength = {15} minLength = {3} style = {{marginTop: '10%',width:'50%'}} value={cTag} placeholder="Tag" className = "input-container"  disabled = {tags.length < 3 ? false : true}onChange={(event) => setcTag(event.target.value)}  />
        </form>
        <div className='tagBox' >
        {tags?.map((n)=> (
          <Tag key = {n + n} TagName = {n} taglist={tags} setTags = {setTags}/>
        ))}
        {fetchedTags.map((n)=> (
          <div key = {n.tagstr}>
          {!tags.includes(n.tagstr) && <Tag  TagName = {n.tagstr} taglist={tags} setTags = {setTags}/>}
          </div>
        ))}
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