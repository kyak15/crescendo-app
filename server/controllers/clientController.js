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

    try {
        const userName = res.locals.user
        const userDataCall = await pool.query('SELECT * FROM reviews WHERE userName = $1', [userName])
        const userReviews = userDataCall.rows // This is the i2
    
        res.json({
            status: 200,
            userReviews
        })
        
    } catch (error) {
        console.log(error)
        res.json({
            status: 500,
            message: 'internal error'
        })
        
    }
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

const getUserListenList = async(req,res)=>{
    try {
        const userName = res.locals.user
        const listenDataCall = await pool.query('SELECT * FROM ListenList WHERE userName = $1', [userName])
        const listenListData = listenDataCall.rows

        return res.json({
            status: 200,
            listenListData
        })

    } catch (error) {
        console.log(error)
        res.json({
            status: 500,
            message: 'Internal Failure of some sort'
        })
        
    }

}

const getAlbumReviews = async(req,res)=>{
    try {
        const albumName = req.params.album
        
        
        
        const dataCall = await pool.query('SELECT * FROM reviews WHERE albumname = $1', [albumName])
        
        return res.json({
            status:200,
            data: dataCall.rows
        })

        
    } catch (error) {
        
    }
}


export { getUserFavoriteFive, getUserReviews, checkUserExists, getUserListenList, getAlbumReviews}