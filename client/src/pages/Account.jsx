import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Styles.css';
import '../components/tags.jsx';
import '../components/sidebar.jsx';

import user from "../configuration/index.js";
import axios from 'axios';

function Account() {
    const navigate = useNavigate();

    const [realName, setRealName] = useState(user.realName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
   
    const [dispColor, setdispColor] = useState("color");
    const [dispAni, setdispAni] = useState("animal");
    const [userColor, setuserColor] = useState("Select Color");
    const [userAni, setuserAni] = useState("Select Animal");

    useEffect(() => {
        if (user.username) {
            var display = user.username.split(" ");
            setuserColor(display[0]);
            setuserAni(display[1]);
        }
    }, [])
    useEffect(() => {
        if (user.id === "") {
            navigate("/login");
        }
    });
    const goHome = (n) => {
        navigate("/");

    }



    const submitDis = () => {
        if (dispAni === "animal" || dispColor === "color") {
       //     console.log("error");
            return;
        }
        const DisplayName = dispColor + " " + dispAni;
        const id = user.id
        const body = { DisplayName, id };
        axios.post("http://localhost:8080/users/username", body)
            .then(res => {
                const { username } = res.data;
                user.username = username;
                goHome();
            })
            .catch((err) => {
            //    console.log(Error);
            });
    }
    return (


        <div className="PageN">
            <div className="container" style={{ minWidth: '550px' }}>
                <h1>Account Info</h1>
                <input type="text" disabled minLength={2} style={{ marginTop: '5%', width: '95%', backgroundColor: 'white', textAlign: 'center' }} value={realName} placeholder="Real Name" className="input-container" onChange={(event) => (setRealName)} />

                <input type="text" disabled minLength={2} style={{ marginTop: '5%', width: '45%', backgroundColor: 'white' }} value={[email]} placeholder="Email" className="input-container" onChange={(event) => (setEmail)} />
                <input type="text" disabled minLength={2} style={{ marginLeft: '2%', marginTop: '5%', width: '45%', backgroundColor: 'white' }} value={phone} placeholder="Phone #" className="input-container" onChange={(event) => (setPhone)} />

                <h1>Display Name</h1>
                <select className='input-container' disabled={user.username} value={dispColor} onChange={(e) => setdispColor(e.target.value)}>
                    <option value="color" disabled>{userColor}</option>
                    <option value="Red">Red</option>
                    <option value="Orange">Orange</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Green">Green</option>
                    <option value="Blue">Blue</option>
                    <option value="Purple">Purple</option>
                    <option value="Magenta">Magenta</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Gray">Gray</option>
                    <option value="Pink">Pink</option>
                    <option value="Brown">Brown</option>
                </select>
                <select className='input-container' disabled={user.username} style={{ marginLeft: '2%' }} value={dispAni} onChange={(e) => setdispAni(e.target.value)}>
                    <option value="animal" disabled>{userAni}</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Fox">Fox</option>
                    <option value="Turtle">Turtle</option>
                    <option value="Cow">Cow</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Bear">Bear</option>
                    <option value="Shark">Shark</option>
                    <option value="Horse">Horse</option>
                    <option value="Fish">Fish</option>
                    <option value="Chicken">Chicken</option>
                </select>
                {!user.username && <button className="Button" style={{ marginLeft: '5%' }} onClick={function () { submitDis() }}>Submit
                </button>}
                <br></br>
                {user.username && <button className="Button" style={{ marginTop: '8%' }} onClick={function () { goHome() }}>Home
                </button>}
                {!user.username && <h2>Select Display Name</h2>}
            </div>

        </div>
    )
}

export default Account;
