import React from 'react'
import { useParams } from 'react-router-dom'


export default function UserReviewPage(){

    const id = useParams().user

    console.log(id)

    React.useEffect(()=>{
        async function getUserReviews(){
            const reviewCall = await fetch(`http://localhost:8000/api/${id}/reviews/`,{
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

            console.log(reviewData.userReviews)

        }
        getUserReviews()
    },[])


    return(
        <h1>User Reviews</h1>
    )
}