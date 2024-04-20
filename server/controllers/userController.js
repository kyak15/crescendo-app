import pool from '../db.js'

const addFavorite = async(req,res)=>{

    try {
    const userName = res.locals.user
    const {albumID, artistID, albumName, artistName, albumArt} = req.body

    const userFavCall = await pool.query('SELECT * FROM FavFive WHERE userName = $1',[userName])
    const userFavData = userFavCall.rows
    
    if(userFavData.length === 5){
        return res.json({
            status: 400,
            message: 'User Already has 5 Favorites'
        })
    }

    //insert into database
    const addMovie = await pool.query('INSERT INTO FavFive (userName, albumID, artistID, albumName, artistName, albumArt) VALUES ($1, $2, $3, $4, $5, $6)', [userName, albumID, artistID, albumName, artistName, albumArt])

  
    res.json({
        status: 201,
        message: 'Album Added to Favorite Five!'
    })
        
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })
        
    }
}

const addListenList = async(req,res)=>{


    //! Need to recreate database to make sure each albumID is Unique
        //! purpose: prevent duplicates - must be done for favfive and reviews(might be different)
    try {
        const userName = res.locals.user
        const {albumID, artistID, albumName, artistName, albumArt, date} = req.body

        const addListen = await pool.query(
            'INSERT INTO ListenList (userName, albumID, artistID, albumName, artistName, albumArt, addedData) VALUES ($1,$2,$3,$4,$5,$6,$7)', 
            [userName, albumID, artistID, albumName, artistName, albumArt, date])
        res.json({
            status: 201,
            message: 'Album added to Listening List'
        })
        
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
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
        res.json({
            status: 201,
            message: 'Review Submitted!'
        })
        
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })   
        
    }
}

const deleteFavorite = async(req,res)=>{

    try {
        //! NOT CORRECT CODE 1 LINE BELOW
        const userID = res.locals.user 
        const {albumName} = req.body
        const dbSearch = await pool.query('DELETE FROM FavoriteFive WHERE userID = $1 AND albumName = $2', [userID, albumName])
        res.json({
            status: 201,
            message: 'Album removed from Favorite Five'
        })
        
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })   
    }
}

const deleteListenList = async(req,res)=>{
    try {
        //! Improper code 1 line below
        const userID = res.locals.user
        const {albumName} = req.body
        const deleteSearch = await pool.query('DELETE FROM ListenList WHERE userID = $1 AND albumName = $2', [userID, albumName])
        res.json({
            status: 201,
            message:'album removed from listen list'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })   
    }
}

const deleteReview = async(req,res)=>{
    try {
        const userID = res.locals.user
        const {albumName} = req.body
        const deleteSearch = await pool.query('DELETE FROM Reviews WHERE userID = $1 AND albumName = $2', [userID, albumName])
        res.json({
            status: 200,
            message: 'Album review Deleted!'
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })   
    }
}

const changeReview = async(req,res)=>{
    try {
        const userID = res.locals.user
        const {albumName, rating} = req.body
        const changeSearch = await pool.query('UPDATE Review SET rating = $1 WHERE userID = $2 AND albumName = $3', [rating, userID, albumName])
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })  
    }
}

const getUserData = async(req,res) =>{
    try {
        const {userID} = res.locals.user
        const favFiveData = await pool.query('SELECT * FROM FavoriteFive WHERE userID = $1', [userID])
        const listenListData = await pool.query('SELECT * FROM ListenList WHERE userID = $1', [userID])
        const reviewData = await pool.query('SELECT * FROM Reviews WHERE userID = $1', [userID])
        res.json({
            status: 200,
            favFiveData,
            listenListData,
            reviewData
        })
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })  
        
    }
}

export {addFavorite, addListenList, addReview, deleteFavorite, deleteListenList, deleteReview, changeReview, getUserData}