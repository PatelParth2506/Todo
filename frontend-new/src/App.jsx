
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ChangePassword from './pages/ChangePassword';
import VerifyEmail from './pages/VerifyEmail';


const App = () => {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/' element = { <HomePage/> }/>
          <Route path='/change-password' element = { <ChangePassword/> }/>
          <Route path='/verify-email' element = { <VerifyEmail/> }/>
        </Routes>
      </main>
    </Router>
  );
};

export default App;
