import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose();
      }
    }, 3000); // Notification disappears after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type} ${visible ? 'show' : 'hide'}`}>
      {message}
      <button className="close-btn" onClick={() => setVisible(false)}>&times;</button>
    </div>
  );
};

export default Notification;
