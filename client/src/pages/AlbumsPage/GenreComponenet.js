import React from 'react'
import albumpage from './albumpage.css'
import { NavLink } from 'react-router-dom'

export default function GenreComponent(props){
    

    /*
       "artist": currentValue.artist,
                "artistID": data.albums.items[0].artists[0].id,
                "albumName": currentValue.album,
                "albumID": data.albums.items[0].id,
                "albumArt": data.albums.items[0].images[0]
    */



    const genreElements = props.trendingData[0].map(item=>{
        
        //<NavLink to={`/albums/${encodeURIComponent(albumName)}`}>
        
        return(
            <div className='album-card-container'>
                <NavLink to={`${item.artist}/${item.albumName}`} ><img src={item.albumArt['url']}/></NavLink>
                <h3>{item.artist}</h3>
                <h4>{item.albumName}</h4> 
            </div>
        )
    })

    return(
    
            <div className='genre-container'>
                {genreElements}
            </div>
          
    )
}