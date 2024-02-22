import React from 'react'
import { NavLink } from 'react-router-dom'

export default function ProfileHeader(){
    return(
        <div className='profile-header-container' >

             <NavLink to='.'>
                Profile
             </NavLink>

             <NavLink to='reviews'>
                Reviews
             </NavLink>

            <NavLink to='listenlist'>
                Listen List
            </NavLink>
            
        </div>
    )
}