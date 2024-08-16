import React, {useContext} from 'react'
import profile from './profile.css'
import {useParams, NavLink} from 'react-router-dom'
import ProfileHeader from '../../components/ProfileLayout'
import FavoriteFive from './FavoriteFive'
import { AuthContext } from '../../UserContext'
const apiURL = process.env.REACT_APP_API_URL

export default function Profile(){

    const id = useParams().user
    let buttonElement;
    const { userName, setUserName } = useContext(AuthContext);
    const [userData, setUserData] = React.useState({
        favData: [],
        reviewData:[],
        listenData: [],
        followerData: [],
        relationship: null
    })
    
    //! CREATE BETTER ROUTE ON SERVER SIDE TO RETURN ALL THE USERDATA IN 1 FUNCTION
    React.useEffect(()=>{
        async function getUserFavorites(){
            const favFiveCall = await fetch(`${apiURL}/api/${id}/favoritefive`,{
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
        
            const reviewCall = await fetch(`${apiURL}/api/${id}/reviews`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })
            const reviewData = await reviewCall.json()

            const listenCall = await fetch(`${apiURL}/api/${id}/listenlist`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })
            const listenData = await listenCall.json()

            const followerCall = await fetch(`${apiURL}/api/${id}/followers/`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })
            const followerRes = await followerCall.json()

            setUserData({
                favData: favData.favoriteData,
                reviewData: reviewData.userReviews.reverse(),
                listenData: listenData.listenListData.reverse(),
                followerData: followerRes.followerData,
                relationship: followerRes.followerData.includes(userName)?true:false
            })
        }
       getUserFavorites()
    },[id, userData])


    async function followUser(){
        try {
            const followRequest = await fetch(`${apiURL}/api/addfollower/`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userToFollow: id})})

            const followData = await followRequest.json()

            if(followData.status !== 201){
                return alert('Unable to Follow User')
            }
            setUserData(prevUserData =>({
                ...prevUserData,
                relationship: true
            }))
            return alert(`Success! You Followed ${id}`)
            
        } catch (error) {
            console.log('ERROR CONNECTING TO SERVER')
        }
    }

    async function unFollowUser(){
        try {
            const endFollowRequest = await fetch(`${apiURL}/api/endfollower/`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({endFollowUser: id})})

            const endFollowData = await endFollowRequest.json()

            if(endFollowData.status !== 201){
                return alert('Unable to Un-Follow User')
            }
            setUserData(prevUserData =>({
                ...prevUserData,
                relationship: false
            }))
            alert(`You Unfollowed ${id}`)

            
            
        } catch (error) {
            console.log('ERROR CONNECTING TO SERVER')
        }
    }


    if(!userName){
        buttonElement = <span className='profile-span'> <NavLink to='/signup'>Sign Up</NavLink></span>
    }

    else if(userName === id){
        buttonElement = <span className='profile-span'><NavLink to='settings/'>Settings</NavLink></span>
    }

    else{
        if(userData.relationship!== false){
            buttonElement = <span className='profile-span' onClick={()=> unFollowUser()}>Unfollow</span>
        }else{
            buttonElement = <span className='profile-span' onClick={()=> followUser()}>Follow</span>
        }
    }
    
    
    if(userData === null){
        return(<div>
            <h3>That user does not exist</h3>
        </div>)
    }


    return(
        <div className='user-page-container'>

                <div className='user-stats'>
                    <h3 className='username'>@{id}</h3>
                    <p>{userData.reviewData.length} Reviews</p>
                    {buttonElement}
                </div>
        
            
            <h3 className='section-title'>Favorite Five</h3>
            <div className='favorite-container'>
                {userData.favData===null?<p>Loading</p>
                :userData.favData.map(album=>{
                    return <NavLink to={`/albums/${album.artistname}/${album.albumname}`}><img src={album.albumart}/></NavLink>
                })}
            </div>
            
            <h3 className='section-title'>{id}'s Recent Reviews</h3>
            <div className='user-reviews'>
                {userData.reviewData===null?<p>Loading</p>:
         
                userData.reviewData.slice(0,5).map(review=>{
                    
                    return<NavLink to={`/albums/${review.artistname}/${review.albumname}/`}><img src={review.albumart}/></NavLink>})}
            </div>

            <h3>{id}'s  Recent Listen List</h3>
            <div className='user-listen'>
                {userData.listenData===null?<p>Loading</p>:
            
            userData.listenData.slice(0,5).map(item=>{
                return <NavLink to={`/albums/${item.artistname}/${item.albumname}`}><img src={item.albumart}/></NavLink>})}
            </div>
        </div>
    )
}