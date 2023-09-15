import React from 'react';
import { Navigate } from 'react-router-dom';
import ServerMessage from "../serverMessage/ServerMessage";

const AuthGuard = ({children}) => {

  if(!localStorage.getItem("isconnected")) {
    return (
      <>
        <ServerMessage 
          message={"Vous n'êtes pas connecté. Veuillez vous connecter."} 
          type="error"
        />
        <Navigate to='/signin' />
      </>
    );
  }

  return children;
};

export default AuthGuard;
