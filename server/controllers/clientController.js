import pool from '../db.js'


function getSQLFormattedDates() {
    const today = new Date();
    today.setDate(today.getDate()+1);
    // Format the current date in SQL format
    const currentDate = formatDate(today);
    
    // Calculate the date from one week ago plus one day
    const oneWeekAgoPlusOneDay = new Date();
    oneWeekAgoPlusOneDay.setDate(today.getDate() - 6); // One week ago plus one day

    const previousDate = formatDate(oneWeekAgoPlusOneDay);

    return {
        currentDate: currentDate,
        previousDate: previousDate
    };
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero and ensure month is 1-indexed
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero
    return `${year}-${month}-${day}`;
}

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


// gets recent reviews from entire database
const getRecentReviews = async(req,res)=>{

    const dateData = getSQLFormattedDates()

        try {
            const recentReviewQuery = await pool.query('SELECT * FROM reviews WHERE addedDate BETWEEN $1 AND $2', [dateData.previousDate, dateData.currentDate])
            const recentReviewData = await recentReviewQuery.rows
            
            return res.json({
                status: 200,
                recentReviewData
            })
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT TO DATABASE'
        })
    }
}

const getUserFollowers = async(req,res)=>{
    try {
        const userName = res.locals.user
        const followerQuery = await pool.query('SELECT (followerUserName) FROM Following WHERE username = $1', [userName])
        const followerRows = await followerQuery.rows
        const followerData = followerRows.map(user=>{
            return user.followerusername
        })
        
        
        return res.json({
            status: 200,
            followerData
        })
        
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE TO CONNECT TO DATABASE'
        })
    }
}

const getUserFollowing = async(req,res)=>{
    try {
        const userName = res.locals.user
        const followingQuery = await pool.query('SELECT (username) FROM Following WHERE followerUserName = $1', [userName])
        const followingData = followingQuery.rows[0].map(user=>{return user.username})
        return res.json({
            status: 200,
            followingData
        })

        
    } catch (error) {
        return res.json({
            status: 500,
            message: 'FAILURE CONNECTING TO DATABASE'
        })
    }
}



export { getUserFavoriteFive, getUserReviews, checkUserExists, getUserListenList, getAlbumReviews, getRecentReviews, getUserFollowers, getUserFollowing}