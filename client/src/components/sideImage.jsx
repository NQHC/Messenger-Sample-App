
import '../pages/Styles.css';
import Chat from '../pages/Chat.jsx';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import user from '../configuration/index';
import axios from 'axios';
//import Rabbit from './rabbit.png';
//const Rabbit = require('./rabbit.png')
import {
  Rabbit,
  Bear,
  Bird,
  Cat,
  Chicken,
  Cow,
  Dog,
  Fish,
  Fox,
  Horse,
  Shark,
  Turtle,
} from './images/index.js'
export default function Link({chatId, NavId}){
    const [userColor,setuserColor] = useState("");
    const [userAni,setuserAni] = useState("");
    const [displayName,setdisplayName] = useState("")
    var Style = function(op) {
      return{
   //   background: backColor,
      //backgroundImage: `url(${Rabbit}) red`,
      backgroundImage:` url(${userAni}),linear-gradient(0deg, ${userColor}, ${userColor})`,

      backgroundSize: '100px 100px',
      backgroundPosition: 'center',
        borderRadius: "50%",
        width: "100px",
        height:"100px",
        cursor:"pointer"
      }
    }
    const colorsTable = {
      Red: "#FF2E2E",
      Blue: "#0E4C92",
      Orange: "#FFC55C",
      Yellow: "#FFFF8A",
      Green:"#8AFF8A",
      Purple:"#C576F6",
      Magenta:"#FF5CFF",
      White:"#EAEFF2",
      Black:"#171717",
      Gray:"#C5C5C5",
      Pink:"#FFC0CB",
      Brown:"#BC9476",
    };
    //filter: invert(29%) sepia(49%) saturate(5428%) hue-rotate(345deg) brightness(109%) contrast(105%);
    const aniTable = {
      Rabbit: Rabbit,
      Fox: Fox,
      Turtle: Turtle,
      Cow: Cow,
      Dog: Dog,
      Cat: Cat,
      Bird: Bird,
      Bear: Bear,
      Shark: Shark,
      Horse: Horse,
      Fish: Fish,
      Chicken: Chicken,
    };
    const colorMapper = (color) => colorsTable[color] || "No Color";
    const animalMapper = (animal) => aniTable[animal] || "No Animal";

    const navigate = useNavigate();
    useEffect(() => {
      checkDisplay();
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
    
  
     const checkDisplay = async() => {
     
        const userId = user.id;
      

      axios.get(`http://localhost:8080/chat/display`,Config({userId,chatId}))
      .then((res) => {
          //console.log(res.data.display);
        //  console.log((res.data.display));
          var display = res.data.display.split(" "); 
          setuserColor(colorMapper(display[0]));
          setuserAni(animalMapper(display[1]));
          setdisplayName(display[0] + " " + display[1]);
          console.log(colorMapper(display[0]))
          //setuserAni(display[1]);
      })
      .catch(function (error) {
      console.log(error);
   });
  }
    const setChat = (id) => { // go to sidebar func to navigate to specific chat room based on this id
        const A = chatId;
        
        console.log(A);
        NavId(A);
        
    }
    return (
        <div>
    
      <button style = {Style()} className = "tooltip" onClick={setChat}>
      <p className="tooltip-text">
        {displayName}
      </p>
      </button> 
      </div>
    );

}
