import pool from '../db'

//TODO:
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
    const {userID} = req.session.token

    const {albumName} = req.body

    //insert into database
    const addMovie = await pool.query('INSERT INTO FavFive (userID, albumName) VALUES ($1,$2)', [userID, albumName])

    //return success status
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
  
        const {userID} = req.session.token

        const {albumName} = req.body
    
        const addListen = await pool.query('INSERT INTO ListenList (userID, albumName) VALUES ($1,$2)', [userID, albumName])
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
        const {userID} = req.sesion.token
        const {albumName, rating, desc, date} = req.body
        const newReview = await pool.query(
            'INSERT INTO Reviews (userID, albumName, rating, desc, date) VALUES($1,$2,$3,$4,$5)'
            ,[userID, albumName, rating, desc, date])
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
        const {userID} = req.session.token 
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
        const {userID} = req.session.token
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
        const {userID} = req.session.token
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
        const {userID} = req.session.token
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

export {addFavorite, addListenList, addReview, deleteFavorite, deleteListenList, deleteReview, changeReview}