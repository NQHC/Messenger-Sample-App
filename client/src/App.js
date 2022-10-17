import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import Chat from "../src/pages/Chat";
import Home from "../src/pages/Home";



function App() {
return(
  <BrowserRouter>
  <Routes>
    <Route path='/chat' element={ <Chat /> }/>
    <Route path='/' element={ <Home /> }/>
  </Routes>
  </BrowserRouter>
)
}
  
export default App;
