import React from 'react'
import { useParams, NavLink } from 'react-router-dom'

export default function UserFollowers(){
    
    const id = useParams().user


    return(
        <div className='user-follower-container'>
            <h3 className='listen-title' >@{id} has 5 followers</h3>

            <div className='follower-container'>

            </div>


        </div>
    )

}