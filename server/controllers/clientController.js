import pool from '../db.js'

const checkUserExists = async(req,res,next) =>{
    const userName = req.params.user
    const userNameCheck = await pool.query('SELECT * FROM users WHERE userName = $1',[userName])
    
    const userNameData = userNameCheck.rows[0] //* Sets the var to the information from SQL injection
    
    


    if(!userNameData){ //* SQL Search checks if null data or if data exists 
        return res.json({
            status: 404
        })
    }

    res.locals.user = userName
    next()
}

const getUserReviews = async(req,res)=>{
  
    const userName = res.locals.user
    const userDataCall = await pool.query('SELECT * FROM reviews WHERE userName = $1', [userName])
    const userReview = userDataCall.rows

    res.json({
        status: 200,
        userReview
    })
}

const getUserFavoriteFive = async(req, res) =>{
    const userName = res.locals.user
    const userDataCall = await pool.query('SELECT * FROM FavFive WHERE userName = $1', [userName])
    const userFavoriteData = userDataCall.rows
    res.json({
        status: 200,
        userFavoriteData
    })
}

export { getUserFavoriteFive, getUserReviews, checkUserExists}