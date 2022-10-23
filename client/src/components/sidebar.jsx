
import '../pages/Styles.css';
import { useNavigate } from "react-router-dom";

export default function SideBar(){
    const navigate = useNavigate();
    const goHome = () => {
        navigate("/");
    }
    return (
        <div className ="SideBar">
        <button className ="Button" style = {{width: '5.5rem'}}onClick = {goHome}>Home</button>
        </div>
    );

}
