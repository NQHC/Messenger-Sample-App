
import '../pages/Styles.css';
import Link from './sideImage.jsx';
import { useNavigate } from "react-router-dom";
import user from '../configuration/index';
const data = [1,2,3,4,5,6,7];
//const data = Array.fromArray({ length: 5 }, (_, index) => index);

export default function SideBar({goChat}){
 
    const navigate = useNavigate();
  
    const setChatId = (id) => {
        goChat(id);
    }
    
    const goHome = () => {
        navigate("/");
    }
    return (
        <div className ="SideBar" >
      
        <button className ="Button" style = {{width: '5.5rem'}} onClick={goHome}>Home</button>
        {user.chats.map(i => <div key={i}>
        
        <Link chatId = {i}  NavId = {setChatId}/>
        </div>)}
        </div>
    );

}
