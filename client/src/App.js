import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Cookies from 'js-cookie';
import Layout from './components/Layout'
import Home from './pages/Home'
//import UserPage from './pages/UserPage'

import UserListenList from './pages/UserListenList'
import UserReviews from './pages/UserReviews'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile';
import LogIn from './pages/LogIn';

//TODO: Need to figure out how to incorporate user auth bc idt putting it in state works??


export default function App(){

  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(()=>{
    async function checkAuth(){
      const data = await fetch('http://localhost:8000/isauth/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
      }
      })
      const dataCheck = await data.json()
      console.log(dataCheck.userName)
  
      if(dataCheck.status !== 200){
        setUser(false)
        setLoading(false)
      }
      else{
        setUser(dataCheck.userName)
        setLoading(false)
      }
    }
    checkAuth()
  },[])
 

  console.log(user)
  return(
    <BrowserRouter>
    
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route index path='/' element={<Home  user = {user}/>}/>
          <Route path='signup' element={<SignUp user={user} setUser ={setUser}/>}/>
          <Route path='login' element={<LogIn/>} />
          <Route path='albums' element={<h1>album page</h1>}/>
          <Route path='albums/:albumname'/>
        


        <Route path='user/:user/' element={<Profile user={user}/>}/>
        <Route path='user/:user/reviews' element={<UserReviews/>}/>
        <Route path='user/:user/listenlist' element={<UserListenList/>}/>

        

        </Route>
      </Routes>
    
    </BrowserRouter>
  
  )
}