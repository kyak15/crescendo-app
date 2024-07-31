import React from 'react';
import lonealbum from './lonealbum.css'
import { useParams } from 'react-router-dom';
import AlbumComp from './AlbumComp';
import dotenv from 'dotenv'
dotenv.config()

export default function LoneAlbumPage(){

    const [album, setAlbum] = React.useState(null)
    const [loading, setLoading] = React.useState(true)

    const id = useParams().album
    

    React.useEffect(()=>{
        async function getAlbumData(){

            const albumCall = await fetch(`${process.env.REACT_APP_API_URL}/api/getlonealbum/${encodeURIComponent(id)}`,{
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
                setLoading(false)
            }

        }
        getAlbumData()
    },[])
    
    

    if(album !== null){
        return(
            <AlbumComp album={album} />
        )
    }
    else if(loading){
        return(
            <h1>Loading!</h1>
        )
    }

    else{
        return(
            <h1>That Page does not Exist!</h1>
        )
    }
}