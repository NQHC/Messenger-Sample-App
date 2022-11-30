
import '../pages/Styles.css';
import Chat from '../pages/Chat.jsx';
import { useNavigate } from "react-router-dom";
export default function Link({chatId, NavId}){
    const navigate = useNavigate();
    const setChat = (id) => { // go to sidebar func to navigate to specific chat room based on this id
        const A = chatId;
       
        
        console.log(A);
        NavId(A);
        
    }
    return (
        <div> 
    <button style = {Style} className = "tooltip" onClick={setChat}>
      <p className="tooltip-text">
        {chatId}
      </p>
      </button>
      </div>
    );

}
const Style = {
    background: "lightblue",
    borderRadius: "50%",
    width: "100px",
    height:"100px",
    cursor:"pointer"
}