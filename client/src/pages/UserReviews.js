import React from 'react'

export default function UserReviews(){

    const [userReviews, setUserReviews] = React.useState([])

    React.useEffect(()=>{
        async function getUserReviews(){
            const dataCall = await fetch(`http://localhost:8000/api/${id.user}/reviews`,{
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
       getUserReviews()
    },[])

  

    return(
        <UserReviews userReviews={userReviews} />
    )
}