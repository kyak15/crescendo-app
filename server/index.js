import express from 'express'
import session from 'express-session';
//import pool from './db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {signUp,logIn, restricted, logOut, isAuth, } from './controllers/authController.js'
import { addFavorite, 
    addListenList, 
    addReview, 
    deleteFavorite, 
    deleteListenList, 
    deleteReview, 
    changeReview,
    

    } from './controllers/userController.js';

import { getUserReviews, getUserFavoriteFive, checkUserExists, getUserListenList, getAlbumReviews, getRecentReviews } from './controllers/clientController.js';

import { getLastFMData, getSpotifyAlbums, getUserSearch, getLoneAlbum,getHomeAlbums, getAlbumPageSearch } from './controllers/spotifyController.js';


const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true

}))
const port = process.env.port || 8000
app.use(session({
    name: 'sesh',
    resave: false,
    saveUninitialized: false,
    secret: process.env.cookieSecret || 'testSecret',
    cookie:{
        maxAge: 1000 * 60 * 60,
        sameSite: "lax",
        secure: false,          
        httpOnly: true 
    },
    
}))
app.use(express.json())
app.use(cookieParser())


//SECURITY ROUTES
app.post('/signup/', signUp)
app.post('/login/', logIn)
app.get('/logout/', logOut)
app.get('/isauth', isAuth)

//USER ROUTES
app.post('/api/addfavorite/', restricted, addFavorite)
app.post('/api/addlistenlist/', restricted, addListenList)
app.post('/api/addreview/', restricted, addReview)
app.delete('/api/deletefavorite/', restricted, deleteFavorite)
app.delete('/api/deletelistenlist/', restricted, deleteListenList)
app.delete('/api/deletereview/', restricted, deleteReview)
app.patch('/api/changereview/', restricted, changeReview)
//app.post('/api/addfollower/', tryCatch(restricted), tryCatch(addFollower))


//CLIENT CONTROLLERS 
app.get('/api/:user/reviews/', checkUserExists, getUserReviews)
app.get('/api/:user/favoritefive', checkUserExists, getUserFavoriteFive)
app.get('/api/:user/listenlist/', checkUserExists, getUserListenList)
app.get('/api/getalbumpagedata/:genre', getLastFMData, getSpotifyAlbums)
app.get('/api/usersearchalbum/', getUserSearch)
app.get('/api/getlonealbum/:album', getLoneAlbum)
app.get('/api/album/:album/reviews', getAlbumReviews)
app.get('/api/getusersearch/:search', getAlbumPageSearch)
app.get('/api/gethomealbums/', getHomeAlbums)
app.get('/api/getrecentreviews/', getRecentReviews)


app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
})







