import React from 'react'
import signup from './signup.css'

import { useNavigate, NavLink } from 'react-router-dom'

export default function SignUp(props){

    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        email:'',
        userName: '',
        password:''
    })

    const handleSubmit = async(e)=>{
        try {
            e.preventDefault()
            const request = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const requestData = await request.json()   
            console.log(`request data client: ${requestData}`)

            if(requestData.status !== 201){
                throw new Error('Signup Failed. Please Try Again')
            }

            navigate('/')
            return window.location.reload()
           
            
            
        } catch (error) {
            console.log(error)
        }
    }

    return(

        <div className='signup-container'>
            <h3 className='signup-title'>Sign Up for Crescendo</h3>
            <h3 className='signup-second-title'>Already a User? <NavLink to='/login'> Click Here to Log in</NavLink> </h3>
            <form>
                
                <input
                    type='email'
                    placeholder='Email'
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
                
                <input
                    type='text'
                    placeholder='user name'
                    onChange={e => setFormData({...formData, userName: e.target.value})}
                />
                
                <input
                    type='password'
                    placeholder='password'
                    min={5}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button onClick={e => handleSubmit(e)}>Sign Up</button>        
        </form>

    

        </div>

  
    )
}