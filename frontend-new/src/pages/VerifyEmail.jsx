import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailAction } from '../services/firebase';
import { verifyUserEmail } from '../services/authService';
import Notification from '../components/Notification';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const actionCode = queryParams.get('oobCode');

    if (mode === 'verifyEmail' && actionCode) {
      const handleVerification = async () => {
        setNotification(null); // Clear previous notifications
        const idToken = await verifyEmailAction(actionCode);
        if (idToken) {
          const response = await verifyUserEmail(idToken);
          if (response) {
            setNotification({ message: "Email verified successfully! You can now log in.", type: "success" });
            setTimeout(() => navigate('/login'), 3000);
          } else {
            setNotification({ message: "Failed to update verification status in our database.", type: "error" });
          }
        } else {
          setNotification({ message: "Invalid or expired verification link.", type: "error" });
        }
      };
      handleVerification();
    }
  }, [location, navigate]);

  return (
    <div className="page-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h1>Email Verification</h1>
      <p>Please wait while we verify your email...</p>
    </div>
  );
};

export default VerifyEmail;
