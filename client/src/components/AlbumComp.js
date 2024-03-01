import React from 'react'
import AlbumPageRate from './AlbumPageRate'
import TrackPlay from './TrackPlay'
import AlbumPageSignUp from './AlbumPageSignUp'

export default function AlbumComp(props){

    const tracks = props.album.albumData.tracks.items.map(track=><p>{track.name}</p>)
    const genres = props.album.artistData.genres.slice(0,2).map(genre=><p>{genre},</p>)

    
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
                    <TrackPlay hits={props.album.trackData.tracks} />
                </div>

                <div className='album-comp-interact'>
                    

                    {!props.user?<AlbumPageSignUp/>:<AlbumPageRate data={props.album.albumData}/>}

        
                </div>
        
        </div>
    )
}