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

    const el = props.trendingData.map(item=>{
        //<NavLink to={`/albums/${encodeURIComponent(albumName)}`}>
        
        return(
            <div className='album-card-container'>
                <NavLink to={item.albumName} ><img src={item.albumArt.url}/></NavLink>
                
                <h2>{item.artist}</h2>
                <h3>{item.albumName}</h3>
            </div>
        )

    })

    return(
        <div className='genre-comp-container'>
            <h2 className='genre-container-title'>{props.genre}</h2>
            <div className='genres-container-bundle'>
                {el}
            </div>
          
        </div>
    )
}