import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom'
import { AuthContext } from '../../UserContext';
import activityPage from './activityPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar} from '@fortawesome/free-solid-svg-icons';
import { faStarHalf} from '@fortawesome/free-solid-svg-icons';


export default function ActivityPage(){
    
    
    const { userName,  setUserName } = useContext(AuthContext);
    const [reviews, setReviews] = React.useState(false)
    
    const apiURL = process.env.REACT_APP_API_URL;
    const FullStar = () => <FontAwesomeIcon className='rating-icon' icon={faStar} />;
    const HalfStar = () => <FontAwesomeIcon className='rating-icon' icon={faStarHalf} />; // Replace with half-star icon if available
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <FullStar key={`full-${index}`} />
                ))}
                {hasHalfStar && <HalfStar />}
            </>
        );
    };
    const reviewElements = reviews === false?<h3>Loading</h3>
    :reviews===null?<h3>Error Retrieving Reviews</h3>:reviews.recent.map(item=>{
        return(
            <div className='ap-single-review'>
                
                <div className='ap-reviews-image'>
                    <NavLink to={`/albums/${item.artistname}/${item.albumname}`}><img src={item.albumart} /></NavLink>
                </div>
                    

                <div className='ap-reviews-info'>
                    <h4>{item.albumname}</h4>
                    <NavLink to={`/user/${item.username}`} >@{item.username}:</NavLink>                        
                    <p>Rating: {renderStars(item.rating)}</p>
                    {item.usertext.length <1?null:<p>"{item.usertext}"</p>}                                                                
                </div>
            </div>
        )
    })

    async function paginateReviews(e){
        e.preventDefault()
    }


    //Default function call is to get the recent reviews from the database
    React.useEffect(()=>{
        async function getRecentReviews(){

            try {
                let followerRecentData;
                const recentReviewRequest = await fetch(`${apiURL}/api/getrecentreviews/`,{ //! CREATE ACTUAL ROUTE ON THE SERVER INDEX.JS
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
    
                const recentReviewProcess = await recentReviewRequest.json()

                
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
        // reviews.recent gives us the list of review objects from the SQL calls 
        
    },[])

    return(

        <div className='activity-page-container'>
            
            <div className='ap-header-container'>
                <h3>Recent Crescendo Reviews</h3>
                <button onClick={()=>paginateReviews()}>Next</button>

            </div>

            <div className='ap-reviews-container'>
                {reviewElements}
            </div>
            
        </div>
    )

}