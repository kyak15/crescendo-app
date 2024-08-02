import React from 'react'
import { useParams, NavLink } from 'react-router-dom'
import profile from './profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar} from '@fortawesome/free-solid-svg-icons';
const options = { month: 'long', day: 'numeric', year: 'numeric' };
const apiURL = process.env.REACT_APP_API_URL

export default function UserReviewPage(){

    const id = useParams().user

    const [userReviews, setUserReviews] = React.useState([])

    React.useEffect(()=>{
        async function getUserReviews(){
            const reviewCall = await fetch(`${apiURL}/api/${id}/reviews/`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })
            const reviewData = await reviewCall.json()

            if(reviewData.status!==200){
                return console.log('error getting review')
            }

            setUserReviews(reviewData.userReviews.reverse())

        
        }
        getUserReviews()
    },[id])


    return(
        <div className='reviews-page-container'>
            <h3 className='page-title'>@{id}'s Reviews</h3>

            <div className='reviews-container'>
                {userReviews.length<1?<p>loading</p>:userReviews.map(review=>{
                    const newDate = new Date(review.addeddate)
                    return(

                        <div className='single-review'>
                            
                            <NavLink to={`/albums/${review.albumname}`}><img src={review.albumart}/></NavLink>

                            <div className='review-info'>
                                <p>{review.albumname}</p>
                                <p>{review.artistname}</p>
                                <p>Reviewed on: {newDate.toLocaleDateString('en-US', options)}</p>
                                <p>{review.rating} <FontAwesomeIcon className='rating-icon' icon={faStar} />'s</p>
                                <p>"{review.usertext}"</p>
                            </div>
                        </div>)
                })}
            </div>

        </div>
    )
}