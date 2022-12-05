
import '../pages/Styles.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import user from '../configuration/index';

export default function ChatBar ({id}){
    const navigate = useNavigate();
    const deleteChat = () => {   
     
        axios.delete("http://localhost:8080/chat/delChat",{data:{id:id}})
        .then(res=>{
            goHome();
        })
        .catch((err)=>{
          console.log("Error:")
            console.log(err.response.data.msg);
        });
       
      };
      const goHome = () => {
        navigate("/");
    }
    return (
        <div style = {Style}>
        <button className = "Button" style = {{position: 'absolute', right:'35px',bottom:'5px',width:'50px',backgroundColor:'red'}} onClick={() =>{deleteChat()}}>➢</button>

        <div style = {{position: 'absolute', left:'35px',bottom:'30%'}}>{user.username}</div>
        </div>
    );

}
const Style = {
    position: 'absolute',
    left:'120px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '8vh',
    minWidth:'330px',
    width: 'calc(100% - 120px)',
    backgroundColor: '#D2E5D0',
    fontFamily: ' Helvetica, Arial, sans-serif',
    fontSize:'24px',
    overflow:'hidden',
}