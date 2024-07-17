import React, {useContext} from 'react';
import { AuthContext } from '../../UserContext';
import activityPage from './activityPage.css'

export default function ActivityPage(){

    const { userName,  setUserName } = useContext(AuthContext);
    const [reviews, setReviews] = React.useState({

    })

    //Default function call is to get the recent reviews from the database
    React.useEffect(()=>{
        async function getRecentReviews(){

            let followerRecentData;
            const recentReviewRequest = await fetch(`http://localhost:8000/api/getrecentreviews/`,{ //! CREATE ACTUAL ROUTE ON THE SERVER INDEX.JS
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const recentReviewData = await recentReviewRequest.json()

            
            //! IMPLEMENT RETREIVEING THE USER'S FOLLOWING RECENT REVIEWS
            //if(userName !== null){
            //    const recentFollowingRequest = await fetch(`http://localhost:8000/api/${id}/listenlist/`,{ //! CREATE ACTUAL ROUTE ON THE SERVER INDEX.JS
            //        method: 'GET',
            //        credentials: 'include',
            //        headers: {
            //          "Content-Type": "application/json"
            //      },
            //    })
            //    followerRecentProcess = await recentFollowingRequest.json()
            //}else{
            //    followerRecentData = false
            //}
            
            //* TRIGGERING THIS MEANS DATABASE CONNECTION ISSUE 
            //! the use of null in the follower data might cause issues if the user has not following bc we might be getting null back from an empty returned sql query 
            if (recentReviewData.status !==200){
                setReviews(null)
            }else{
                setReviews({
                    recent: recentReviewData.rows,
                })
            }
        }
        getRecentReviews()

        // reviews.recent gives us the list of review objects from the SQL calls 
        console.log(reviews.recent)
    },[])

    return(
        
        <div className='activity-page-container'>
            <h3>Recent Crescendo Reviews </h3>


        </div>
    )

}