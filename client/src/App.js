import React, {useContext, useState}from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Cookies from 'js-cookie';
import Layout from './components/Layout'
import Home from './pages/home/Home';
import UserListenList from './pages/profile/UserListenList'
import SignUp from './pages/signup/SignUp'
import Profile from './pages/profile/Profile';
import LogIn from './pages/login/LogIn';
import AlbumsPage from './pages/AlbumsPage/AlbumsPage';
import LoneAlbumPage from './pages/LoneAlbumPage/LoneAlbumPage';
import ProfileHeader from './components/ProfileHeader';
import UserReviewPage from './pages/profile/UserReviewPage';
import UserFollowers from './pages/profile/UserFollowers';
import ActivityPage from './pages/ActivityPage/ActivityPage';



export default function App(){  

  return(
    <BrowserRouter>
      <Routes>
        

          <Route element={<Layout/>}>
              <Route index path='/' element={<Home/>}/>
              <Route path='signup' element={<SignUp/>}/>
              <Route path='login' element={<LogIn/>} />
              <Route path='albums' element={<AlbumsPage/>}/>
              <Route path='activity/' element={<ActivityPage/>}/>
              <Route path='albums/:album' element={<LoneAlbumPage/>} />
            <Route element={<ProfileHeader />}>
              <Route index path='user/:user/' element={<Profile/>}/> 
              <Route path='user/:user/reviews' element={<UserReviewPage/>}/>
              <Route path='user/:user/listenlist' element={<UserListenList/>}/>
              <Route path='user/:user/followers' element={<UserFollowers/>}/>          
            </Route>
          </Route>
        
      </Routes>
    
    </BrowserRouter>
  
  )
}