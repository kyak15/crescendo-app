import React from 'react'
import { NavLink, useParams, Outlet } from 'react-router-dom'

export default function ProfileHeader(){

    const id = useParams().user
    
    return(

        <div className='profile-layout-container'>
            <div className='profile-layout-nav'>

                <NavLink to={`user/${id}/`} >
                    Profile
                </NavLink>

                <NavLink to={`user/${id}/following`}>
                    Following
                </NavLink>

                <NavLink to={`user/${id}/followers`}>
                    Followers
                </NavLink>

                <NavLink to={`user/${id}/reviews`}>
                    Reviews
                </NavLink>

                <NavLink to={`user/${id}/listenlist`}>
                    Listen List
                </NavLink>


                
            </div>
            <Outlet/>
        </div>
        
    )
}