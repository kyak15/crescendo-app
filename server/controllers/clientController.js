import pool from '../db.js'
import {getChart, listCharts} from 'billboard-top-100'
//TODO: Maybe include the Spotify API here that way when the client calls from front
     //TODO: we get the actual spotify data rather than the postgres data


const clientID = 'ec6970aaf81e40b988e933b770cb88d5'
const clientSecret = 'f67c5bcc171a44af94547aa6456a80ad'

const getSpotifyToken = async(req,res)=>{
    const spotifyAuth = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      });

      const spotifyToken = await spotifyAuth.json()
      //console.log(spotifyToken.access_token)
      return spotifyToken.access_token
    }

    
    



    


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
    const userReview = userDataCall.rows // This is the i2



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


const spotifyTest = async(req,res)=>{
    const spotifyToken = await getSpotifyToken()
    console.log(spotifyToken)
    const albumName = "Rumours(SuperDeluxe)"
    const artistName = 'fleetwoodmac'

    //* THIS CODE RETURNS THE ID OF AN ARTIST OR ALBUM 
        //* SHOULD STORE THE IDS IN SQL SO OUR SEARCHES ARE FASTER
        //! THE ARTIST NAMES AND ALBUMS MUST BE 1 SINGLE STRING NO SPACES!!
    const getAlbumData = await fetch(
        `https://api.spotify.com/v1/search?q= 
        ${encodeURIComponent(artistName + ' ' + albumName)}
        &type=album&limit=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${spotifyToken}`,
      },
    });
    const data = await getAlbumData.json()

    res.json({
        data
    })


    

}

export { getUserFavoriteFive, getUserReviews, checkUserExists, getSpotifyToken, spotifyTest}