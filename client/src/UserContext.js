// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import dotenv from 'dotenv'
dotenv.config()

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);

  React.useEffect(()=>{
    async function checkAuth(){
  
        const authCheck = await fetch(`${process.env.REACT_APP_API_URL}/isauth/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json"
        }
        })
        const authData = await authCheck.json()

        if(authData.status !== 200){
            setUserName(null)   
        }
        else{
            setUserName(authData.userName)
        }
    }

    
      checkAuth()
    
  },[]);

  return (
    <AuthContext.Provider value={{ userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
