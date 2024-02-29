import React from 'react'
import {useParams} from 'react-router-dom'
import ProfileHeader from '../components/ProfileLayout'
import FavoriteFive from '../components/FavoriteFive'


export default function Profile(props){


    const [userData, setUserData] = React.useState({
        favFive: '',
        
    })

    const id = useParams().user

  


    React.useEffect(()=>{
        async function getUserFavorites(){
            const favFiveCall = await fetch(`http://localhost:8000/api/${id.user}/favoritefive`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const favData = await favFiveCall.json()

            //TODO: Straigten out backend code for getting reviews
                //TODO: Might not even want the user reviews on this page so TBD
            /*
            const reviewCall = await fetch(`http://localhost:8000/api/${id.user}/reviews`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
              
            })

            const reviewData = reviewCall.json()
            */

        
       
            if(favData.status!==200){
                console.log('error getting user reviews')
                setUserData(null)
            }else{
                setUserData({favFive: favData.favoriteData})
            }
        }
       getUserFavorites()
    },[])

    return(
        <div className='user-page-container'>
            <h2>{id}</h2>
            <div className='fav-container'>
                

            </div>

        </div>
    )
}