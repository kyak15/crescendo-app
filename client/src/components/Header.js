import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header(props){



    return(
        <div className='header-layout'>
            <NavLink className='logo-header-layout' to='/'>Crescendo</NavLink>
            <NavLink className='links-header-layout' to='albums'>Albums</NavLink>
            {props.user?<NavLink className='links-header-layout' to='activity'>Activity</NavLink>:
            <NavLink className='links-header-layout' to='signup'>Sign Up</NavLink>}
            {props.user?<NavLink className='links-header-layout' to={`/user/${props.user}`} >Profile</NavLink>:
            <NavLink className='links-header-layout' to='login'>Log In</NavLink>}
        </div>
    )
}