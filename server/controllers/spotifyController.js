import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()
const clientID = process.env.clientID
const clientSecret = process.env.clientSecret
const lastFMURL = 'https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&format=json&limit=24' 
const lastFMKey= process.env.lastFMKey


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
    
        
        res.cookie('spotToken', spotifyToken.access_token,{
            httpOnly: true,
            secure: false, //!this should be changed to true when in production, fine as false in dev
            maxAge: 1000*60*60
        })
        return spotifyToken.access_token
        
  
}

async function mapJSFunc(toke, currentValue) {
    
    return await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent
        (currentValue.artist + ' ' + currentValue.album)}&type=album&limit=1`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${toke}`,
            }
        })
        .then(data => {
            if (data.status === 200) {
                return data;
            }
            else{
                throw new Error('Error reaching Spotify Data')
            }
        })
        .then(data => data.json())
        .then(data => {
            return{
                "artist": currentValue.artist,
                "artistID": data.albums.items[0].artists[0].id,
                "albumName": currentValue.album,
                "albumID": data.albums.items[0].id,
                "albumArt": data.albums.items[0].images[0]
            }
        })
        .catch(error=>{
            return res.json({
                status: error.status,
                message: error.message
            })
        })
}


// function retrieves Spotify IDs of artists and albums to display on Albums Page of Client side
const getSpotifyAlbums = async(req,res)=>{
    
    
    const lastData = req.data
    

    //* lastData[0]['indie+rock']) THIS GETS US THE GENRE ARRAY OF ALBUM/ARTIST OBJECTS
    const spotifyToken = req.cookies.spotToken || await getSpotifyToken(req, res); // Pass req and res to getSpotifyToken

    
    let spotData = []    
    const indieRockData = await Promise.all(lastData.map(item => mapJSFunc(spotifyToken, item)))
        .then(data => spotData.push(data))
        .catch(error => {
            console.error('Error processing data:', error);
            return res.status(500).json({
                status: 500,
                message: 'Error processing data'
            });
        });   

    //success code:
    res.json({
        status: 200,
        spotData
    })
}


// gets the search data from the search bar on albums page 
const getUserSearch = async(req,res)=>{

    //! THIS FUNCTION SHOULD ALSO WORK FOR REQ.PARAM SEARCHES LIKE IN THE URL
    /*
        if(!req.params.length > 0){
            console.log(111)
        }

    */


    try {

        // get spotify token
        const spotifyToken = await getSpotifyToken()

        //set user search into var
        //! NEED TO FIGURE OUT HOW TO GET THE ALBUM NAME BEING SEARCHED FOR 
        const userSearchAlbum = req.body


        // fetch a spotify search using the user submitted value 

        const searchFetch = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent
        (userSearchAlbum.album)}&type=album&limit=10`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            }
        })

        if(searchFetch.status!== 200){
            throw new Error('Error Retrieving Data from Spotify API')
        }
        
        const searchData = await searchFetch.json()
        //! SEARCH BY THIS DATA TYPE = SEARCHDATA.ALBUMS.ITEMS

        const searchArr = await searchData.albums.items.map(album=>{
            return {
                artist: album.artists[0].name,
                artistID: album.artists[0].id,
                album: album.name,
                albumID: album.id
            }
        })

        //! THIS SENDS THE DATA AS THE FOLLOWING:
        /*
                "searchArr": [
            {
                "artist": "Nirvana",
                "artistID": "6olE6TJLqED3rqDCT0FyPh",
                "album": "Nevermind (Remastered)",
                "albumID": "2guirTSEqLizK7j9i1MTTZ"
            },
            {
                ETC...
            }
        
        */
        res.json({
            searchArr
        })
  
        
    } catch (error) {
        console.log(error)
        res.json({
            status: 500,
            message: error.message
        })
    }
}

//Gets the Trending albums of the genres below 
const getLastFMData = async(req,res, next)=>{
     
    
    let finalData = [];
    const genre = req.params.genre;
    
    try {
        const lastFMRequest = await fetch(lastFMURL+'&tag='+genre+'&limit='+'&'+lastFMKey);
        if(!lastFMRequest.ok){
            throw new Error(`HTTP Error: Status: ${lastFMRequest.status}`)
        }

        const lastFMData = await lastFMRequest.json()
        const albumData = lastFMData.albums.album
        
        
        const mapData = albumData.map(album =>{
            return{
                "album": album.name,
                "artist": album.artist.name
            }
        })
        finalData = mapData
        
    } catch (error) {
        console.error(`Error for ${genre}:`, error);
        return res.status(401).json({
            message: 'Failure fetching genre data'
        })
    }

    req.data = finalData;
    next()
}



const getLoneAlbum = async(req,res)=>{
    try {

        // get the album name from the url params
        const spotifyToken = req.cookies.spotToken || await getSpotifyToken(req, res); // Pass req and res to getSpotifyToken
        const albumPageName = req.params.album
        
        
        //search if that album even exists 
        const userSearchSpotCall = await fetch(`https://api.spotify.com/v1/search?q=${albumPageName}&type=album&limit=1`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${spotifyToken}`,
            },
          })

        const userSearchSpotData = await userSearchSpotCall.json()

        if(userSearchSpotData.albums.items.length < 1){
            throw new Error('Album Doesnt Exist!')
        }

        const userSpotID = userSearchSpotData.albums.items[0].id

        const userSpotDataCall = await fetch(`https://api.spotify.com/v1/albums/${userSpotID}`,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${spotifyToken}`,
            },
        })

        if(userSpotDataCall.status!== 200){
            throw new Error({
                status: 404,
                message: 'Album does not exist!'
            })
        }

    
        const userSpotData = await userSpotDataCall.json()
        

        
        const artistCall = await fetch(`https://api.spotify.com/v1/artists/${userSpotData.artists[0].id}`,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${spotifyToken}`,
            },
        }
        )

        if(artistCall.status!== 200){
            throw new Error({
                status: 404,
                message: 'Artist does not exist!'
            })
        }

        const artistData = await artistCall.json()
        

        // gets the popular tracks
        const trackCall = await fetch(`https://api.spotify.com/v1/artists/${userSpotData.artists[0].id}/top-tracks?market=US`,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${spotifyToken}`,
            },
        })

        if(trackCall.status!==200){
            throw new Error('Tracks not availble')
        }

        const trackData = await trackCall.json()

        return res.json({
            status:200,
            userSpotData,
            artistData,
            trackData
        })

        
    } catch (error) {
        console.log(error)
        return res.json({
            status: 404,
            error: error.message
        })
        
    }
}



const getHomeAlbums = async(req,res)=>{
    
    const spotifyToken = req.cookies.spotToken ?req.cookies.spotToken: await getSpotifyToken(req,res)
    

    let homeData = []

    const beatlesCall = await fetch(`https://api.spotify.com/v1/search?q=abbeyroad&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })

    const kendrickCall = await fetch(`https://api.spotify.com/v1/search?q=to+pimp+a+butterfly&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })
    
      const floydCall = await fetch(`https://api.spotify.com/v1/search?q=The dark side of the moon&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })

      const amyCall = await fetch(`https://api.spotify.com/v1/search?q=backtoblackamy&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })

    const laurenCall = await fetch(`https://api.spotify.com/v1/search?q=miseducation+of+lauren+hill&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })

      const fleetCall = await fetch(`https://api.spotify.com/v1/search?q=rumours&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })


    const strokeCall = await fetch(`https://api.spotify.com/v1/search?q=is+this+it&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })
    
      const daftCall = await fetch(`https://api.spotify.com/v1/search?q=discovery&type=album&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
        },
      })

    const beatlesData = homeData.push(await beatlesCall.json())

    const kendrickData = homeData.push(await kendrickCall.json())
    const floydData = homeData.push(await floydCall.json())
    const amyData = homeData.push(await amyCall.json())
    const laurenData = homeData.push(await laurenCall.json())
    const fleetData = homeData.push(await fleetCall.json())
    const strokeData = homeData.push(await strokeCall.json())
    const daftData = homeData.push(await daftCall.json())

    return res.json({
        status: 200,
        homeData
    })
}

const getAlbumPageSearch = async(req,res)=>{

    try {
        const userSearch = req.params.search
        const spotifyToken = req.cookies.spotToken ?req.cookies.spotToken: await getSpotifyToken(req,res)
        const searchCall = await fetch(`https://api.spotify.com/v1/search?q=${userSearch}&type=album&limit=10`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${spotifyToken}`
            }})
        const searchData = await searchCall.json()
        
        
        return res.json({
            status: 200,
            searchData
        })
            
    } catch (error) {
        console.log(error)
        return res.json({
            status: 500,
            message: error.message
        })
    }   
}

  export {getSpotifyAlbums, getLastFMData, getUserSearch, getLoneAlbum, getHomeAlbums, getAlbumPageSearch}