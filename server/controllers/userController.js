import pool from '../db.js'


const addFavorite = async(req,res)=>{

    //* previous restricted route controller ensures user exists and cookie is present


    try {
        const userName = res.locals.user
        const {albumID, artistID, albumName, artistName, albumArt} = req.body
        const userFavCall = await pool.query('SELECT * FROM FavFive WHERE userName = $1',[userName])
        const userFavData = userFavCall.rows
        const checkDup = await pool.query('SELECT favID from FavFive where albumID = $1 and userName = $2', [albumID, userName])
        
    
        if(userFavData.length === 5 || checkDup.rows.length !== 0){
            return res.json({
                status: 409,
                message: '5 favorite albums already exist or duplicate attempted'
            })
        }

        const addMovie = await pool.query('INSERT INTO FavFive (userName, albumID, artistID, albumName, artistName, albumArt) VALUES ($1, $2, $3, $4, $5, $6)', [userName, albumID, artistID, albumName, artistName, albumArt])    


        return res.json({
            status: 201,
            message: 'Album Added to Favorite Five!'
        })
        
    } catch (error) {
        return res.json({
            status: 500,
            message: 'Error Connecting to database'
        })
    }
}

const addListenList = async(req,res)=>{

    try {
        const userName = res.locals.user
        const {albumID, artistID, albumName, artistName, albumArt, date} = req.body
        const checkDup = await pool.query('SELECT listenid from ListenList WHERE userName = $1 and albumID = $2', [userName, albumID])
        
        if(checkDup.rows.length !== 0){
            return res.json({
                status: 409,
                message: 'Album already exists in User Listen List'
            })
        }
    
        const addListen = await pool.query(
            'INSERT INTO ListenList (userName, albumID, artistID, albumName, artistName, albumArt, addedData) VALUES ($1,$2,$3,$4,$5,$6,$7)', 
            [userName, albumID, artistID, albumName, artistName, albumArt, date])
    
        
        return res.json({
            status: 201,
            message: 'Album added to Listening List'
        })
        
    } catch (error) {
        res.json({
            status: 500,
            message: 'Error connecting to database'
        })
    }
    
  
}


const addReview = async(req,res)=>{

    try {

        const userName = res.locals.user
        const {albumID, artistID, albumName, artistName, albumArt, rating, text, date} = req.body

        const newReview = await pool.query(
            'INSERT INTO Reviews (userName, albumID, artistID, albumName, artistName, albumArt, rating, userText, addedDate) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)'
            ,[userName, albumID, artistID, albumName, artistName, albumArt, rating, text, date])
            
        return res.json({
            status: 201,
            message: 'Review Submitted!'
        })
        
    } catch (error) {
        res.json({
            status: 500,
            message: 'Error connecting to database'
        })
    }

    
}

const deleteFavorite = async(req,res)=>{

    try {
        const userName = res.locals.user 
        const {albumName} = req.body
        const deleteCall = await pool.query('DELETE from FavFive WHERE userName = $1 and albumName = $2', [userName, albumName])

        return res.json({
            status: 201,
            message: 'Album Removed from Favorite Five'
        })
        
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT OR DELETE FROM DATABASE'
        })
    }



}

const deleteListenList = async(req,res)=>{
    try {
        const userName = res.locals.user
        const {albumName} = req.body
        const deleteSearch = await pool.query('DELETE FROM ListenList WHERE userName = $1 AND albumName = $2', [userName, albumName])
    
        return res.json({
            status: 201,
            message:'album removed from listen list'
        })
    } catch (error) {
        return res.json({
            status:500,
            message: 'failure to connect or delete from database'
        })
        
    }
}

const deleteReview = async(req,res)=>{
    
    try {
        const userName = res.locals.user
        const {albumName} = req.body
        const deleteSearch = await pool.query('DELETE FROM Reviews WHERE userName = $1 AND albumName = $2', [userName, albumName])
    
        return res.json({
            status: 200,
            message: 'Album review Deleted!'
        })
        
    } catch (error) {
        return res.json({
            status:500,
            message: 'FAILURE TO CONNECT OR DELETE FROM DATABASE'
        })
        
    }
}

const changeReview = async(req,res)=>{

    try {
        const userName = res.locals.user
        const {albumName, rating} = req.body
        const changeSearch = await pool.query('UPDATE Reviews SET rating = $1 WHERE userName = $2 AND albumName = $3', [rating, userName, albumName])
    
        return res.json({
            status: 201,
            message: 'Edited Review'
        })
        
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT OR CHANGE FROM DATABASE'
        })
        
    }
}

const getUserData = async(req,res) =>{
    try {
        const {userName} = res.locals.user
        const favFiveData = await pool.query('SELECT * FROM FavFive WHERE userName = $1', [userName])
        const listenListData = await pool.query('SELECT * FROM ListenList WHERE userName = $1', [userName])
        const reviewData = await pool.query('SELECT * FROM Reviews WHERE userName = $1', [userName])
        const followingData = await pool.query('SELECT * FROM Following WHERE followerUserName = $1', [userName])
        const followerData = await pool.query('SELECT * FROM Following WHERE username = $1',[userName])
    
        return res.json({
            status: 200,
            favFiveData,
            listenListData,
            reviewData,
            followingData,
            followerData
        })
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT TO DATABASE'
        })
    }
}

const followUser = async(req,res)=>{
    try {
        const userName = res.locals.user
        const {userToFollow} = req.body
        const followQuery =  await pool.query('INSERT INTO Following (userName, followerUserName) VALUES($1, $2)', [userToFollow, userName])
        
        return res.json({
            status: 201,
            message: 'Successful Follow Request'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT OR INSERT INTO DATABASE'
        })
    }
}

const endFollow = async(req,res)=>{

    //! This needs to find the followID then delete it 
    try {
        const userName = res.locals.user
        const {endFollowUser} = req.body
        const endFollowQuery = await pool.query('DELETE FROM Following where userName = $1 and followerUserName = $2 ', [endFollowUser, userName])
        return res.json({
            status: 201,
            message: 'Successful Un-Follow'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT OR DELETE FROM DATABASE'
        })
    }
}


export {addFavorite, addListenList, addReview, deleteFavorite, deleteListenList, deleteReview, changeReview, getUserData, followUser, endFollow }
