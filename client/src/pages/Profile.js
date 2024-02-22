import React from 'react'
import {useParams, Outlet} from 'react-router-dom'
import ProfileHeader from '../components/ProfileHeader'
import FavoriteFive from '../components/FavoriteFive'

/*
- WHAT SHOULD HAPPEN ON THIS PAGE:
    - DISPLAY THE USERNAME
    - PROFILE LINKS TO OTHER PAGES
    - FOLLOWING/FOLLWERS LIST
    - FAVORITE FIVE
    - RECENT ACTIVITY
        - INFORMATION THAT WE NEED FROM THE BACKEND: 
            FAVFIVE, RECENT REVIEWS, LISTEN LIST FOLLOWING, 
- PLAN:
    - im thinking we fetch ALL the user data from the backend
    - some function on the backend checks if the user even exists 
        - if it doesnt we redirect the user to a 404 page
    - then since we have all the data, we use those as props and send them to the components we have in this page 
*/

export default function Profile(props){

    const id = useParams()

    const [userFavorites, setUserFavorites] = React.useState([])

    /* useEffect needs to get the following:
        - is the username valid in our db?
        -Favorite five  
    */
    React.useEffect(()=>{
        async function getUserFavorites(){
            const dataCall = await fetch(`http://localhost:8000/api/${id.user}/favoritefive`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const data = await dataCall.json()
       
            if(data.status!==200){
                console.log('error getting user reviews')
            }

            setUserReviews(data.userReview)
        }
       getUserFavorites()
    },[])

    return(
        <div className='profile-container'>
            <div className='user-info-container'>
                <h3>{id.user}</h3>
                <p>{`User has ${userReviews.length} Reviews`}</p>
            </div>
            <ProfileHeader/>
            <FavoriteFive user={id.user} userFavorites={userFavorites}/>
        </div>
    )
}