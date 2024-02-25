
const clientID = 'ec6970aaf81e40b988e933b770cb88d5'
const clientSecret = 'f67c5bcc171a44af94547aa6456a80ad'
const lastFMURL = 'https://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&format=json&limit=20' 
const lastFMKey= 'api_key=cc9731b881b69331e019c18c8a635c7e'
const popularGenres = ['indie+rock','hip-hop', 'pop', 'rnb', 'electronic']

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
      return spotifyToken.access_token
}


//! Need to discuss faster API Call ?
//! Need to discuss Calling this function only once from the list of Genres Data 
//! Optimizing it to less than 2.5 Seconds??
async function mapJSFunc(currentValue) {
    const spotifyToken = await getSpotifyToken()
   
    
    return await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent
        (currentValue.artist + ' ' + currentValue.album)}&type=album&limit=1`,{
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${spotifyToken}`,
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
    //const spotifyToken = await getSpotifyToken() //! dont need this code
    
    const lastData = req.data
    

    //* lastData[0]['indie+rock']) THIS GETS US THE GENRE ARRAY OF ALBUM/ARTIST OBJECTS

    //TODO: 
        //? Despite working, maybe theres a way of only doing this in 1-3 lines rather than 10

    let spotData = []    
    const indieRockData = await Promise.all(lastData[0]['indie+rock'].map(mapJSFunc))
        .then(data => spotData.push({[popularGenres[0]]: data}));    
    const hipHopData = await Promise.all(lastData[1]['hip-hop'].map(mapJSFunc))
        .then(data => spotData.push({[popularGenres[1]]: data}));
    const popData = await Promise.all(lastData[2]['pop'].map(mapJSFunc))
        .then(data => spotData.push({[popularGenres[2]]: data}));
    const rnbData = await Promise.all(lastData[3]['rnb'].map(mapJSFunc))
        .then(data => spotData.push({[popularGenres[3]]: data}));
    const electronicData = await Promise.all(lastData[4]['electronic'].map(mapJSFunc))
        .then(data => spotData.push({[popularGenres[4]]: data}));

    //success code:
    res.json({
        status: 200,
        spotData
    })
}


// gets the search data from the search bar on albums page 
const getUserSearch = async(req,res)=>{

    //! THIS FUNCTION SHOULD ALSO WORK FOR REQ.PARAM SEARCHES LIKE IN THE URL


    try {

        // get spotify token
        const spotifyToken = await getSpotifyToken()

        //set user search into var
        //! NEED TO FIGURE OUT HOW TO GET THE ALBUM NAME BEING SEARCHED FOR 
        const userSearchAlbum = req.body
        if(!req.params.length > 0){
            console.log(111)

            
        }


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
     
    let lastFMData =[]

    //iterate through genres and fetch trending albums from LastFM API
    // adjusts the API data to just push the album name/artist into each genre in LastFMData Array
    for (const genre of popularGenres) {
        try {
            const response = await fetch(lastFMURL+'&tag='+genre+'&'+lastFMKey);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const finalData = data.albums //returns 20 item array of album info

            const moreData = finalData.album.map(item=>{
                return {
                    "album": item.name,
                    "artist": item.artist.name
                }
            })
            
            lastFMData.push({
                [genre]: moreData
            });
            
        } catch (error) {
            console.error(`Error for ${genre}:`, error);
        }
    }
    //res.locals.FMData = lastFMData  
    req.data = lastFMData
    next()
}






  export {getSpotifyAlbums, getLastFMData, getUserSearch}