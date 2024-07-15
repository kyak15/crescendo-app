import pool from '../db.js'
const clientID = 'ec6970aaf81e40b988e933b770cb88d5'
const clientSecret = 'f67c5bcc171a44af94547aa6456a80ad'


const checkUserExists = async(req,res,next) =>{
    
    const userName = req.params.user
    const userNameCheck = await pool.query('SELECT * FROM users WHERE userName = $1',[userName])
    const userNameData = userNameCheck.rows[0] //* Sets the var to the information from SQL injection
    
    if(!userNameData){  
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
        const userReviews = userDataCall.rows 
    
        return res.json({
            status: 200,
            userReviews
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT TO DATABASE'
        })
    }
}

const getUserFavoriteFive = async(req, res, next) =>{
    try {
        const userName = res.locals.user
        const userDataCall = await pool.query('SELECT * FROM FavFive WHERE userName = $1', [userName])
        const favoriteData = userDataCall.rows
        res.locals.favoriteData = favoriteData
        
        res.json({
            status: 200,
            favoriteData
        })
    } catch (error) {
        return res.json({
            status:500,
            message: 'FAILURE TO CONNECT TO DATABASE'
        })
        
    }
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
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT TO DATABASE'
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
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT TO DATABASE'
        })
    }
}


export { getUserFavoriteFive, getUserReviews, checkUserExists, getUserListenList, getAlbumReviews}