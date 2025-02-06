// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './User';  
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import MainContent from './components/MainContent';

import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
function App() {
  return (
 
    <div>
      <BrowserRouter>
        <Routes>
          
          <Route path='/' element={<User />}></Route>
          <Route path='/create' element={<CreateUser />}></Route>
          <Route path='/update' element={<UpdateUser />}></Route>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
