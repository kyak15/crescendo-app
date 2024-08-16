import express from 'express'
import session from 'express-session';
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
    followUser,
    endFollow,
    } from './controllers/userController.js';
import { getUserReviews, getUserFavoriteFive, checkUserExists, getUserListenList, getAlbumReviews, getRecentReviews, getUserFollowers, getUserFollowing } from './controllers/clientController.js';
import { getLastFMData, getSpotifyAlbums, getUserSearch, getLoneAlbum,getHomeAlbums, getAlbumPageSearch } from './controllers/spotifyController.js';
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors({
    origin: 'http://147.182.140.49:3000',
    credentials: true
}))

const port = 8000


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
app.delete('/api/deletefavorite/:album/', restricted, deleteFavorite)
app.delete('/api/deletelistenlist/:album/', restricted, deleteListenList)
app.delete('/api/deletereview/', restricted, deleteReview)
app.patch('/api/changereview/', restricted, changeReview)
app.post('/api/addfollower/', restricted, followUser)
app.post('/api/endfollower/', restricted, endFollow)

//CLIENT CONTROLLERS 
app.get('/api/:user/reviews/', checkUserExists, getUserReviews)
app.get('/api/:user/favoritefive', checkUserExists, getUserFavoriteFive)
app.get('/api/:user/listenlist/', checkUserExists, getUserListenList)
app.get('/api/:user/followers/', checkUserExists, getUserFollowers)
app.get('/api/:user/following', checkUserExists, getUserFollowing)
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







