import React, {useContext} from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { AuthContext } from '../UserContext'


export default function Header(){
    
    const { userName,  setUserName } = useContext(AuthContext);

    const [activeSearch, setActiveSearch] = React.useState(false)

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