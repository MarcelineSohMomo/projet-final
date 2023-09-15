import React, { useState } from 'react';
import { useEffect } from 'react';

const ServerMessage = ({ message, type }) => {
    const [show, setShow] = useState(true);
    
    useEffect(() => {
      setShow(true); // Réinitialisez l'état `show` lorsque le message change
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [message]); 
    if (!show) return null;
    const className = type === 'error' ? 'alert-danger' : 'alert-success';
    return (
      <div className={`alert ${className} mt-3`} role="alert">
        {message}
      </div>
    );
};

export default ServerMessage;

