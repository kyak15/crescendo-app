// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
const apiURL = process.env.REACT_APP_API_URL

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);

  React.useEffect(()=>{
    async function checkAuth(){
  
        const authCheck = await fetch(`/isauth/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json"
        }
        })
        const authData = await authCheck.json()
        console.log(authData)

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
