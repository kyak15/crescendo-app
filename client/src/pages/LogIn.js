import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LogIn(props){
    const navigate = useNavigate()

    const [formData, setFormData] = React.useState({
        email:'',
        password:''
    })

    const handleCookie = async(e)=>{
        e.preventDefault()

    }

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

            
            
            //props.setUser(true)
            window.location.reload()
            navigate('/')
    
        } catch (error) {
            console.log(error)
        }
    }

    return(
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

            <button onClick={e => handleSubmit(e)}>Sign Up</button>        
            <button onClick={e=> handleCookie(e)}>Check cookie</button>    
        </form>
    )
}
