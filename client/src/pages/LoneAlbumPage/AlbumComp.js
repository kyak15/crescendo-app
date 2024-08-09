import React, {useContext} from 'react'
import { NavLink } from 'react-router-dom'
import lonealbum from './lonealbum.css'
import AlbumPageRate from './AlbumPageRate'
import TrackPlay from './TrackPlay'
import AlbumPageSignUp from './AlbumPageSignUp'
import { AuthContext } from '../../UserContext'
const options = { month: 'long', day: 'numeric', year: 'numeric' };
// <p>Reviewed on: {newDate.toLocaleDateString('en-US', options)}</p>
const apiURL = process.env.REACT_APP_API_URL
export default function AlbumComp(props){

    const [albumReviews, setAlbumReviews] = React.useState([])
    const {  userName,  setUserName } = useContext(AuthContext);


    const tracks = props.album.albumData.tracks.items.map(track=><p>{track.name}</p>)
    const genres = props.album.artistData.genres.slice(0,2).map(genre=><p className='genre'>{genre} </p>)

    React.useEffect(()=>{
        async function getAlbumReviews(){
            
            const reviewCall = await fetch(`${apiURL}/api/album/${props.album.albumData.name}/reviews/`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const reviewData = await reviewCall.json()            

            if(reviewData.status!==200){
                setAlbumReviews(null)
            }else{
                setAlbumReviews(reviewData.data.reverse())
            }

            

        }
        getAlbumReviews()
    },[])
    
    

    return(
        <div className='album-comp-container'>


            <div className='album-info'>
                
                <div className='album-comp-image'>
                    <img src={props.album.albumData.images[0].url} />
                    <h2>{props.album.albumData.name}</h2>
                    {tracks}
                </div>

                    {/**PUT THERE GENRES AND TOP TRACKS IN THIS DIV!!! */}
                <div className='album-desc'>
                    <h2 className='artist-title'>{props.album.albumData.artists[0].name}</h2>
                    <p className='genres-title'>Genres: {genres}</p>
                    <TrackPlay hits={props.album.trackData.tracks} />
                </div>

                
                {!userName?<AlbumPageSignUp/>:<AlbumPageRate data={props.album.albumData}/>}
                
            </div>
            
            <div className='album-users-container'>
                <h3 className='review-title'>Recent Reviews for {props.album.albumData.name}</h3>
                {albumReviews!==null?albumReviews.map(review=>{
                    const newDate = new Date(review.addeddate)
                    
                    return <div className='album-review'>
                    

                    <div className='review-info'>
                    <NavLink to={`/user/${review.username}`} >@{review.username}:</NavLink>
                        <p>{review.rating} Stars</p>
                        
                        
                        
                 
                        {review.usertext.length <1?null:<p>"{review.usertext}"</p>}
                    </div>
                </div>

                }):<p>Error getting Reviews</p>}

            </div>


        </div>
    )
}