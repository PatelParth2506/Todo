import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { signupWithGoogle, registerWithEmail } from '../services/firebase';
import Notification from './Notification';
import '../styles/Form.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null); // Clear previous notifications
    const firebaseUser = await registerWithEmail(email, password);
    if (firebaseUser) {
      const response = await register(username, email, password, firebaseUser.uid);
      if (response) {
        setNotification({ message: 'Registration successful! Please check your email to verify your account.', type: 'success' });
      } else {
        setNotification({ message: 'Failed to register user in our database. Please try again.', type: 'error' });
      }
    } else {
      setNotification({ message: 'Firebase registration failed. Please check the console for errors.', type: 'error' });
    }
  };

  const handleGoogleSignup = async () => {
    const res = await signupWithGoogle();
    if (res) {
      if (res.data[2] === 'new') {
        localStorage.setItem('token', res.data[1]);
        setNotification({ message: "Google signup successful! Please change your password.", type: "success" });
        navigate('/change-password');
      } else {
        localStorage.setItem('token', res.data[1]);
        setNotification({ message: "Google login successful!", type: "success" });
        navigate('/');
      }
    } else {
      setNotification({ message: "Google signup failed.", type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h2>Register</h2>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
      <button type='button' onClick={handleGoogleSignup}>Sign Up With Google</button>
    </form>
  );
};

export default Register;