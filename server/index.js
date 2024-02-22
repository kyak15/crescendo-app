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

import { getUserReviews, getUserFavoriteFive, checkUserExists, getSpotifyToken, spotifyTest } from './controllers/clientController.js';

import { getLastFMData, getSpotifyAlbums } from './controllers/spotifyController.js';

const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true

}))
const port = process.env.port || 8000


//MIDDLEWARE
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


//TODO
// ROUTES FOR HOMEPAGE
    // get trending albums(from crescnedo NOT billboard!) to display 
// ROUTES FOR USER PAGE
// ROUTES FOR ALBUMS PAGE (TRENDING PAGE)



//SECURITY ROUTES
app.post('/signup/', signUp)
app.post('/login/', logIn)
app.get('/logout/', logOut)
app.get('/isauth', isAuth)

//USER ROUTES
//? I think these would be calls on the album pages?

app.post('/api/addfavorite/', restricted, addFavorite)
app.post('/api/addlistenlist/', restricted, addListenList)
app.post('/api/addreview/', restricted, addReview)
app.delete('/api/deletefavorite/', restricted, deleteFavorite)
app.delete('/api/deletelistenlist/', restricted, deleteListenList)
app.delete('/api/deletereview/', restricted, deleteReview)
app.patch('/api/changereview/', restricted, changeReview)


//CLIENT CONTROLLERS 
app.get('/api/:user/reviews', checkUserExists, getUserReviews)
app.get('/api/:user/favoritefive', checkUserExists, getUserFavoriteFive)


app.get('/api/getalbumpagedata', getLastFMData, getSpotifyAlbums)
app.get('/api/token', getSpotifyToken)




app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`)
})



