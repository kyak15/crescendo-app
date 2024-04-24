import React from 'react';
import lonealbum from './lonealbum.css'
import { useParams } from 'react-router-dom';
import AlbumComp from './AlbumComp';

export default function LoneAlbumPage(props){

    const [album, setAlbum] = React.useState(null)

    const id = useParams().album
    

    React.useEffect(()=>{
        async function getAlbumData(){

            const albumCall = await fetch(`http://localhost:8000/api/getlonealbum/${encodeURIComponent(id)}`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              }
            })
            
            const albumData = await albumCall.json()

            if(albumData.status!==200){
                //! probably set a navigate to an error page
                setAlbum(null)
            }else{
                setAlbum(
                    {albumData: albumData.userSpotData,
                     artistData: albumData.artistData,
                     trackData: albumData.trackData   
                    })
            }

        }
        getAlbumData()
    },[])
    
    

    if(album === null){
        return(
            <h1>That Page does not exist!</h1>
        )
    }
    if(album){
        return(
            <AlbumComp album={album} user={props.user}/>
        )
    }
}