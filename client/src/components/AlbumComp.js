import React from 'react'
import AlbumPageRate from './AlbumPageRate'

export default function AlbumComp(props){

    const tracks = props.album.albumData.tracks.items.map(track=><p>{track.name}</p>)
    const genres = props.album.artistData.genres.map(genre=><p>{genre},</p>)
    let hits=[];
    
    

    for(let i=0;i<4;i++){
        hits.push(<div>
                    <p>{props.album.trackData.tracks[i].name}</p>
                    
                    <button>{props.album.trackData.tracks[i].preview_url}</button>

                    

                </div>)
    }
    

    return(
        <div className='album-comp-container'>

                <div className='album-comp-image'>
                    <img src={props.album.albumData.images[0].url} />
                    <h2>{props.album.albumData.name}</h2>
                    {tracks}
                    
                </div>

                {/**PUT THERE GENRES AND TOP TRACKS IN THIS DIV!!! */}
                <div className='album-comp-desc'>
                    <h2>{props.album.albumData.artists[0].name}</h2>   
                    {genres}
                    {hits}

                </div>

                <div className='album-comp-interact'>
                    <AlbumPageRate/>
                </div>
        
        </div>
    )
}