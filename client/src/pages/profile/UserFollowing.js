import React from 'react'
import { useParams, NavLink } from 'react-router-dom'
const apiURL = process.env.REACT_APP_API_URL

export default function UserFollowing(){
    
    const [followers, setFollowers] = React.useState(false)

    const id = useParams().user

    React.useEffect(()=>{
        async function getUserFollowers(){

            try {
                const followRequest = await fetch(`${apiURL}/api/${id}/followers/`,{
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
    
                const followData = await followRequest.json()

                if(followData.status !== 200){
                    setFollowers(null)
                }else{
                    console.log(followData.followerData)
                    setFollowers(followData.followerData)
                }

            
            //? I imagine if things get caught here we should be stopping the app?
                    //? since server side api cant be reached?
            } catch (error) {
                
                console.log('ERROR REACHING SERVER')
                
            }

        }
        getUserFollowers()
    },[id])


    return(
        <div className='user-follower-container'>
            {followers===false?<h3>Loading!</h3>
            :followers===null?<h3>Error Retrieving Followers</h3>:            
            <div className='data-container'>
                <h3 className='listen-title' >@{id}'s Following:</h3>
                {followers.map(item=>{
                    return(
                        <NavLink to={`/user/${item}/`}>@{item}</NavLink>
                    )
                })}
            </div>}
        </div>
    )

}