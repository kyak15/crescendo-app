import pool from '../db.js'

//TODO:
    // catch errors might be wrong in each of the functions on this page
    // Fix the status numbers for each function both successful and fails need the correct numbers 
    // addFavorite needs to check if 5 fav albums already exist 
    // Each add function needs to actually get the userID from the token
        //(rn i accidently just set userID = token, so that needs to be fixed in all 3 add functions and future functions/routes)
        //? const decoded = await promisify(jwt.verify)(token, secret) is the code but IDK if i should put it in the restricted auth function
        //? or keep it in each route function? 
        //? if i put it in restricted middleware, i should set req.locals.userID = await promisify
            //? .locals allows the passing of data from middleware to route handlers (according to chatGPT lol)
    // need to figure out how im going to get data like album name and rating, etc from the front end bc rn im using req.body
        // this is in all 3 functions rn 
    //? In each of the ADD routes, maybe we send back to info from the SQL entry (specifically the id)
        //? that way on the front end, those components hold the ids making it easier to delete and not havign to always use the userID
        //? in SQL inqueries??

const addFavorite = async(req,res)=>{

    try {
    //get user id from token 
   
    const userName = res.locals.user
    const {albumID, artistID} = req.body

    const userFavCall = await pool.query('SELECT * FROM FavFive WHERE userName = $1',[userName])
    const userFavData = userFavCall.rows
    
    if(userFavData.length === 5){
        return res.json({
            status: 400,
            message: 'User Already has 5 Favorites'
        })
    }

    //insert into database
    const addMovie = await pool.query('INSERT INTO FavFive (userName, albumID, artistID) VALUES ($1, $2, $3)', [userName, albumID, artistID])

  
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

    try {
  
        /*
            listenID SERIAL PRIMARY KEY,
    userName VARCHAR(255) REFERENCES users(userName) on DELETE CASCADE,
    albumID VARCHAR(255) NOT NULL,
    artistID VARCHAR(255) NOT NULL,
    addedData DATE NOT NULL*/

        const userName = res.locals.user
        const {albumID, artistID, date} = req.body
    
        const addListen = await pool.query('INSERT INTO ListenList (userName, albumID, artistID, addedData) VALUES ($1,$2,$3,$4)', [userName, albumID, artistID, date])
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

        /*
                albumID: '',
        artistID: '',
        rating: '',
        text:'',
        date: new Date()
        */

        const userName = res.locals.user
        console.log(`username in user cont: ${userName}`)
        const {albumID, artistID, rating, text, date} = req.body

        const newReview = await pool.query(
            'INSERT INTO Reviews (userName, albumID, artistID, rating, userText, addedDate) VALUES($1,$2,$3,$4,$5,$6)'
            ,[userName, albumID, artistID, rating, text, date])
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