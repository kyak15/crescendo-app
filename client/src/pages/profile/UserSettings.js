import React, {useContext} from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { AuthContext } from '../../UserContext'

export default function UserSettings(){
    
    const { userName, setUserName } = useContext(AuthContext);
    const id = useParams().user

    return(
        <div className='settings-container'>
            <div className='mini-container'>
                <h3>Change Email:</h3>
                <button>Change Email</button>
            </div>

            <div className='mini-container'>
                <h3>Change UserName:</h3>
                <button>Change UserName</button>
            </div>

            <div className='mini-container'>
                <h3>Change Password:</h3>
                <button>Change Password</button>
            </div>

            <div className='mini-container'>
                <h3>Delete Account:</h3>
                <button>Delete Account</button>

            </div>




        </div>
    )

}