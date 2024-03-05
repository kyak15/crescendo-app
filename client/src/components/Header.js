import React from 'react'
import { useNavigate, NavLink } from 'react-router-dom'


export default function Header(props){
    const navigate = useNavigate()

    async function handleLogout(){
        const logCall = await fetch(`http://localhost:8000/logout/`,{
            method: 'GET',
            credentials: 'include',
            headers: {
              "Content-Type": "application/json"
          },
        })

        const logData = await logCall.json()
        if(logData.status===200){
            navigate('/')
            return window.location.reload()
        }

    }



    return(
        <div className='header-layout'>
            <NavLink className='logo-header-layout' to='/'>Crescendo</NavLink>
            <NavLink className='links-header-layout' to='albums'>Albums</NavLink>
            {props.user?<NavLink className='links-header-layout' to='activity'>Activity</NavLink>:
            <NavLink className='links-header-layout' to='signup'>Sign Up</NavLink>}
            {props.user?<NavLink className='links-header-layout' to={`/user/${props.user}`} >Profile</NavLink>:
            <NavLink className='links-header-layout' to='login'>Log In</NavLink>}
            {props.user?<NavLink onClick={handleLogout} className='links-header-layout'>Logout</NavLink>:null}
        </div>
    )
}