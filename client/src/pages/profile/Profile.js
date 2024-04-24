import React from 'react'
import profile from './profile.css'
import {useParams, NavLink} from 'react-router-dom'
import ProfileHeader from '../../components/ProfileLayout'
import FavoriteFive from './FavoriteFive'


export default function Profile(props){

    const [userData, setUserData] = React.useState({
        favData: [],
        reviewData:[],
        listenData: []
    })


    const id = useParams().user

    React.useEffect(()=>{
        async function getUserFavorites(){
            const favFiveCall = await fetch(`http://localhost:8000/api/${id}/favoritefive`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const favData = await favFiveCall.json()
            
            if(favData.status===404){
                return setUserData(null)
            }
            //! NEED TO PROBABALY CREATE SOMETHING ELSE IF USER DOESNT HAVE FAV SET

            const reviewCall = await fetch(`http://localhost:8000/api/${id}/reviews`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const reviewData = await reviewCall.json()


            const listenCall = await fetch(`http://localhost:8000/api/${id}/listenlist`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })
            
            const listenData = await listenCall.json()

            
            setUserData({
                favData: favData.favoriteData,
                reviewData: reviewData.userReviews.reverse(),
                listenData: listenData.listenListData
            })
        }
       getUserFavorites()
    },[])

    
    
    if(userData === null){
        return(<div>
            <h3>That user does not exist</h3>
        </div>)
    }

    return(
        <div className='user-page-container'>

            <div className='user-info-container'>
                <h3 className='username'>@{id}</h3>
                <div className='user-stats'>
                    <p>{userData.reviewData.length} Reviews</p>
                    
                </div>
                {/*Gonna place the Users Number of followers, reviews, and listen list values*/}
            </div>

            
            <h3 className='section-title'>Favorite Five</h3>
            <div className='favorite-container'>
                {userData.favData===null?<p>Loading</p>
                :userData.favData.map(album=>{
                    return <NavLink to={`/albums/${album.albumname}`}><img src={album.albumart}/></NavLink>
                })}
            </div>
            
            <h3 className='section-title'>{id}'s Recent Reviews</h3>
            <div className='user-reviews'>
                {userData.reviewData===null?<p>Loading</p>:
         
                userData.reviewData.slice(0,5).map(review=>{
                    console.log(review)
                    return    <NavLink to={`/albums/${review.albumname}/`}><img src={review.albumart}/></NavLink>})}
            </div>

            <h3>{id}'s  Recent Listen List</h3>
            <div className='user-listen'>
                {userData.listenData===null?<p>Loading</p>:
            
            userData.listenData.slice(0,5).map(item=>{
                return <NavLink to={`/albums/${item.albumname}`}><img src={item.albumart}/></NavLink>})}

            </div>
        </div>
    )
}