import React from 'react'

export default function UserReviews(props){

    React.useEffect(()=>{
        async function getSpotifyAlbums(){
            const albumCall = await fetch()

        }
        getSpotifyAlbums()
    },[])

    if(props.userReviews.length > 0){
        return(
            //create code that looks like history page from LB
        )
    }
    else{
        return(
            <div className='userReview-container'>
                <h3>User has not reviewed any albums yet!</h3>
            </div>
        )
    }
}