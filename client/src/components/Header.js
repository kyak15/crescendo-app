import React, {useContext} from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { AuthContext } from '../UserContext'
const apiURL = process.env.REACT_APP_API_URL


export default function Header(){
    
    const { userName,  setUserName } = useContext(AuthContext);

    const [activeSearch, setActiveSearch] = React.useState(false)

    const navigate = useNavigate()

    async function handleLogout(){
        const logCall = await fetch(`${apiURL}/logout/`,{
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
            <NavLink className='links-header-layout' to='activity/'>Activity</NavLink>
            {userName
                ?null
                :<NavLink className='links-header-layout' to='/signup'>Sign Up</NavLink>
            }

            {userName
            ?<NavLink className='links-header-layout' to={`/user/${userName}`}>Profile</NavLink>
            :<NavLink className='links-header-layout' to='/login'>Log In</NavLink>
            }

            {userName
            ?<NavLink onClick={handleLogout} className='links-header-layout'>Logout</NavLink>
            :null
            }
        </div>
    )
}