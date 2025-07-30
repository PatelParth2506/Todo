import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/authService';
import Notification from '../components/Notification';
import '../styles/Form.css';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null); // Clear previous notifications
    const response = await changePassword(password);
    if (response) {
      setNotification({ message: "Password changed successfully!", type: "success" });
      navigate('/');
    } else {
      setNotification({ message: "Failed to change password.", type: "error" });
    }
  };

  return (
    <div className="page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Change Password</h2>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
