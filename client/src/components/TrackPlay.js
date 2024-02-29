import React from 'react'

export default function TrackPlay(props){

    const [tracksMP3, setTracksMP3]= React.useState({})
    const [playing, setPlaying] = React.useState(false)
    const [trackAudio, setTrackAudio] = React.useState()
    
    
    React.useEffect(()=>{
        if(props.hits){
            const artistSongs = props.hits.slice(0,3).map(song=>{
                return({
                    title: song.name,
                    mp3: song.preview_url
                })
            })
            setTracksMP3(artistSongs)
        }else{
            setTracksMP3(null)
        }
    },[])


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

    const trackPieces = props.hits.slice(0,3).map(song=>{
        return(
            <div className='trackplay-song-container'>
                <button onClick={e=>toggleSong(song.name)}>Listen</button>
                <h2>{song.name}</h2>
            </div>
        )
    })
    
    return(
        <div className='trackplay-container'>
            {trackPieces}             
        </div>
    )
}