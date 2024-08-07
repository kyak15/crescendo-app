import React, {useContext} from 'react'
import signup from './signup.css'
import { useNavigate, NavLink } from 'react-router-dom'
import { AuthContext } from '../../UserContext'
const apiRUL = process.env.REACT_APP_API_URL

export default function LogIn(){

    const { userName,  setUserName } = useContext(AuthContext);

    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        email:'',
        password:''
    })



    const handleSubmit = async(e)=>{
        try {
            e.preventDefault()
            const request = await fetch(`${apiRUL}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const requestData = await request.json()   
            console.log(`requestData login: ${requestData}`)

            if(requestData.status !== 200){
                throw new Error(requestData.message)
            }
            setUserName(requestData.userName)
            return navigate('/')
            
    
        } catch (error) {
            alert(error.message)
        }
    }

    return(

        <div className='signup-container'>
            <h3 className='signup-title'>Log In</h3>
            <h3 className='signup-second-title'>Not a User? <NavLink to='/signup'> Click Here Sign Up!</NavLink> </h3>
            <form>
                <input
                type='email'
                placeholder='Email'
                onChange={e => setFormData({...formData, email: e.target.value})}
                />

                <input
                type='password'
                placeholder='password'
                onChange={e => setFormData({...formData, password: e.target.value})}

                />

                <button onClick={e => handleSubmit(e)}>Log In</button>        
            </form>

            <h3>Forgout your password? Click here to reset</h3>

        </div>
    
    )
}
