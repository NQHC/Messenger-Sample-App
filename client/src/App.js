import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import Chat from "../src/pages/Chat";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Account from "../src/pages/Account";


function App() {
return(
  <BrowserRouter>
  <Routes>
    <Route path='/chat' element={ <Chat /> }/>
    <Route path='/' element={ <Home /> }/>
    <Route path='/login' element={ <Login /> }/>
    <Route path='/account' element={ <Account /> }/>

  </Routes>
  </BrowserRouter>
)
}
  
export default App;
