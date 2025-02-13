// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Sidebar from './components/Sidebar';
// import Navbar from './components/Navbar';
// import MainContent from './components/MainContent';
import Signup from './pages/Signup';  
import Login from './pages/Login';  

import CreateApp from './applications/CreateApp';
import Application from './applications/Application';  

import UpdateUser from './UpdateUser';

import Dashboard from './pages/Dashboard';


import Frequency from './frequency/Create_freq';

import FrequencyIndex from './frequency/Frequency';

import EmployeeCreate from './employee/CreateEmployee';

import Employee from './employee/IndexEmoloyee';

import Reviewer from './reviewer_dashboard/Dashboard'

import User from './user/createUser';

import Audit from './audit/create_audit';

function App() {
  return (
 
    <div>
      <BrowserRouter>
        <Routes>
          
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>

          <Route path='/create_frequency' element={<Frequency />}></Route>
          <Route path='/frequency' element={<FrequencyIndex />}></Route>


          <Route path='/app' element={<Application />}></Route>
          <Route path='/createapp' element={<CreateApp />}></Route>
          <Route path='/update' element={<UpdateUser />}></Route>
        
          <Route path='/employecreate' element={<EmployeeCreate />}></Route>
          <Route path='/employe' element={<Employee />}></Route>

          <Route path='/reviewer' element={<Reviewer />}></Route>
          <Route path='/user' element={<User />}></Route>

          <Route path='/create_audit' element={<Audit />}></Route>


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
