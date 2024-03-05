import React from 'react'
import lonealbum from './lonealbum.css'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket} from '@fortawesome/free-solid-svg-icons';

export default function AlbumPageSignUp(){
    return(
        <div className='signup-comp-container'>
            <h3>Log in to Review!</h3>
            <NavLink to='/login'><FontAwesomeIcon className='signin-icon' icon={faRightToBracket} />Login</NavLink>
            <NavLink to='/signup'><FontAwesomeIcon className='signin-icon' icon={faRightToBracket} />Sign Up</NavLink>
        </div>
    )
}