import pool from '../db.js'
import {getChart, listCharts} from 'billboard-top-100'
//TODO: Maybe include the Spotify API here that way when the client calls from front
     //TODO: we get the actual spotify data rather than the postgres data


const clientID = 'ec6970aaf81e40b988e933b770cb88d5'
const clientSecret = 'f67c5bcc171a44af94547aa6456a80ad'


const checkUserExists = async(req,res,next) =>{
    const userName = req.params.user
    console.log(userName)
    const userNameCheck = await pool.query('SELECT * FROM users WHERE userName = $1',[userName])
    const userNameData = userNameCheck.rows[0] //* Sets the var to the information from SQL injection
    
    if(!userNameData){ //* SQL Search checks if null data or if data exists 
        return res.json({
            status: 404,
            message: 'User Does not Exist!'
        })
    }

    res.locals.user = userName
    next()
}

const getUserReviews = async(req,res)=>{
  
    const userName = res.locals.user
    const userDataCall = await pool.query('SELECT * FROM reviews WHERE userName = $1', [userName])
    const userReview = userDataCall.rows // This is the i2

    //TODO needs to call spotify api for album information 

    res.json({
        status: 200,
        userReview
    })
}

const getUserFavoriteFive = async(req, res, next) =>{
    const userName = res.locals.user
    const userDataCall = await pool.query('SELECT * FROM FavFive WHERE userName = $1', [userName])
    const favoriteData = userDataCall.rows
    res.locals.favoriteData = favoriteData
    

    //TODO needs to call spotify api for album information 

    res.json({
        status: 200,
        favoriteData
    })
}


export { getUserFavoriteFive, getUserReviews, checkUserExists}