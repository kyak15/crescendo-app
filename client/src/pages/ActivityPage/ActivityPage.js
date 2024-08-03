import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../../UserContext';
import activityPage from './activityPage.css'
const apiURL = process.env.REACT_APP_API_URL

export default function ActivityPage(){

    const { userName,  setUserName } = useContext(AuthContext);
    const [reviews, setReviews] = React.useState(false)

    //Default function call is to get the recent reviews from the database
    React.useEffect(()=>{
        async function getRecentReviews(){

            try {
                let followerRecentData;
                const recentReviewRequest = await fetch(`http://server:8000/api/getrecentreviews/`,{ //! CREATE ACTUAL ROUTE ON THE SERVER INDEX.JS
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                      "Content-Type": "application/json"
                  },
                })
    
                const recentReviewProcess = await recentReviewRequest.json()
                //! IMPLEMENT RETREIVEING THE USER'S FOLLOWING RECENT REVIEWS

                
    
    
                //? MOST LIKELY need to set reviews to a boolean or null for the following:
                    //? false if reviews is empty
                    //? null if connection issue??
                
            
                console.log(recentReviewProcess)
                
                if (recentReviewProcess.status !==200){
                    setReviews(null)
                }else{
                    
                    setReviews({
                        recent: recentReviewProcess.recentReviewData.reverse()
                    })
                }
            // for failure to reach backend server
            } catch (error) {
                console.log('failure to reach backend')
            }
        }
         
        getRecentReviews()
        console.log(reviews.recent)
        // reviews.recent gives us the list of review objects from the SQL calls 
        
    },[])


    console.log(apiURL)

    return(
        
        <div className='activity-page-container'>
            
            <div className='ap-header-container'>
                <h3>Recent Crescendo Reviews</h3>
            </div>

            <div className='ap-reviews-container'>
                {reviews === false?<h3>Loading</h3>
                :reviews===null?<h3>Error Retrieving Reviews</h3>:reviews.recent.map(item=>{
                    return(
                        <div className='ap-single-review'>
                            
                            <div className='ap-reviews-image'>
                                <NavLink to={`/albums/${item.albumname}`}><img src={item.albumart} /></NavLink>
                            </div>
                                

                            <div className='ap-reviews-info'>
                                <h4>{item.albumname}</h4>
                                <NavLink to={`/user/${item.username}`} >@{item.username}:</NavLink>
                                <p>{item.rating} Stars</p>
                                <p>{item.usertext}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            


        </div>
    )

}