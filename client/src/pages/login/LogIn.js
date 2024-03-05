import React from 'react'
import login from './login.css'
import { useNavigate, NavLink } from 'react-router-dom'

export default function LogIn(props){
    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        email:'',
        password:''
    })



    const handleSubmit = async(e)=>{
        try {
            e.preventDefault()
            const request = await fetch('http://localhost:8000/login', {
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
                throw new Error('Signup Failed. Please Try Again')
            }

            
            navigate('/')
            return window.location.reload()
    
        } catch (error) {
            console.log(error)
        }
    }

    return(

        <div className='login-container'>
            <h3 className='login-title'>Log In</h3>
            <h3 className='login-second-title'>Not a User? <NavLink to='/signup'> Click Here Sign Up!</NavLink> </h3>
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
