import React from 'react'
import lonealbum from './lonealbum.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay} from '@fortawesome/free-solid-svg-icons';

export default function TrackPlay(props){

    const [tracksMP3, setTracksMP3]= React.useState({})
    const [playing, setPlaying] = React.useState(false)
    const [trackAudio, setTrackAudio] = React.useState()
    
    

    // 
    
    React.useEffect(()=>{
        if(props.hits){
            const artistSongs = props.hits.map(song=>{
                
                if(song.preview_url !== null){
                    return({
                        title: song.name,
                        mp3: song.preview_url
                    })
                }
                return({
                    title: song.name,
                    mp3: null
                })
            })
            
            setTracksMP3(artistSongs)
        }else{
            setTracksMP3(null)
        }
   

    },[]);


    function toggleSong(song){
        if(!playing){
            const mp3 = tracksMP3.filter(item=>{
                
                if(item.title ===song){
                    return item.mp3
                }
            })
            const audio = new Audio(mp3[0].mp3)
            setTrackAudio(audio)
            setPlaying(true)
            audio.play()
        }
        


        
        else{
            setPlaying(false)
            trackAudio.pause()
        }
        
    }

    const trackPieces = props.hits.slice(0,5).map(song=>{
        
        if(song.preview_url!==null){
            return(
                <div onClick={e=>toggleSong(song.name)}  className='trackplay-song-container'>
                    <FontAwesomeIcon 
                    className='icon'
                    
                    icon={faPlay} />
                    
                    <h2 className='song-title'>{song.name}</h2>
                </div>
            )
        }
        return null

    })

    
    
    
    return(
        <div className='trackplay-container'>
                <p className='trackplay-title'>Popular tracks:</p>
            {
   

            trackPieces[0]!==null?trackPieces
            :(<div>
                <p className='trackplay-none'>The artist does not provide sample tracks</p>
            </div>
                
                )
            }             
        </div>
    )
}