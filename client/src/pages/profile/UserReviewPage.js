import React from 'react'
import { useParams, NavLink } from 'react-router-dom'
import profile from './profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar} from '@fortawesome/free-solid-svg-icons';
import { faStarHalf} from '@fortawesome/free-solid-svg-icons';
const options = { month: 'long', day: 'numeric', year: 'numeric' };
const apiURL = process.env.REACT_APP_API_URL


export default function UserReviewPage(){

    const id = useParams().user
    const [userReviews, setUserReviews] = React.useState([])
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
                            
                            <NavLink to={`/albums/${review.artistname}/${review.albumname}`}><img src={review.albumart}/></NavLink>

                            <div className='review-info'>
                                <p>{review.albumname}</p>
                                <p>{review.artistname}</p>
                                <p>Reviewed on: {newDate.toLocaleDateString('en-US', options)}</p>
                                <p>Rating: {renderStars(review.rating)}</p>
                                <p>"{review.usertext}"</p>
                            </div>
                        </div>)
                })}
            </div>

        </div>
    )
}