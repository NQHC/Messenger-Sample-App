
import '../pages/Styles.css';
import Chat from '../pages/Chat.jsx';
import { useNavigate } from "react-router-dom";
export default function Link({chatId, NavId}){
    const navigate = useNavigate();
    const setChat = (id) => {
        const A = chatId;
       
        
        console.log(A);
        NavId(A);
        
    }
    return (
        <div> 
    <button style = {Style} class = "tooltip" onClick={setChat}>
      <p class="tooltip-text">
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