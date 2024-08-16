import React, {useContext} from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../UserContext'
const apiURL = process.env.REACT_APP_API_URL
export default function UserSettings(){
    
    const navigate = useNavigate()
    const { userName, setUserName } = useContext(AuthContext);
    const id = useParams().user
    const [changeEmail, setChangeEmail] = React.useState({
        oldEmail: '',
        newEmail: ''
    })
    const [changePass, setChangePass] = React.useState({
        oldPassword: '',
        newPassword: ''
    })
    const [deletePass, setDeletePass] = React.useState()
    
    
    async function handleEmailChange(e){
        e.preventDefault()
        const body = JSON.stringify(changeEmail)
        try {
            const emailChangeRequest = await fetch(`${apiURL}/api/newemail/`,{
                method: 'PATCH',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
              body:body
              })
            
            const emailChangeData = await emailChangeRequest.json()

            if(emailChangeData.status !== 200){
                return alert('Failure to Change Email')
            }

            return alert('Successfully Changed Email!')
            
            
        } catch (error) {
            return alert('Failure to Reach Server')
        }
        
    }

    async function handlePassChange(e){
        e.preventDefault()
        const body = JSON.stringify(changePass)
        try {
            const passChangeRequest = await fetch(`${apiURL}/api/changepassword/`,{
                method: 'PATCH',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
              body:body
              })
            
            const passChangeData = await passChangeRequest.json()

            if(passChangeData.status !== 200){
                return alert('Failure to Change Password')
            }

            alert('Successfully Changed Password!')
            
            
        } catch (error) {
            return alert('Failure to Reach Server')
        }
    }

    async function handleDelete(e){
        e.preventDefault()
        
        
        
        try {
            const body = JSON.stringify(deletePass)
            const passChangeRequest = await fetch(`${apiURL}/api/deleteuser/`,{
                method: 'DELETE',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
              body:body
              })
            
            const passChangeData = await passChangeRequest.json()

            if(passChangeData.status !== 200){
                return alert('Failure to Delete Account')
            }

            alert('Successfully Deleted Account')
            return navigate('/')
            
            
        } catch (error) {
            return alert('Failure to Reach Server')
        }
    }

    return(
        <div className='settings-container'>
            
            <div className='mini-container'>
                <h3>Change Email:</h3>
                <textarea onChange={e =>setChangeEmail({...changeEmail, oldEmail:e.target.value})} placeholder='Enter Old Email'></textarea>
                <textarea onChange={e =>setChangeEmail({...changeEmail, newEmail:e.target.value})} placeholder='Enter New Email'></textarea>
                <button onClick={e => handleEmailChange(e)}>Submit Change</button>
            </div>    


                <div className='mini-container'>
                <h3>Change Password:</h3>
                <textarea onChange={e =>setChangePass({...changePass, oldPassword:e.target.value})} placeholder='Enter Old Password'></textarea>
                <textarea onChange={e =>setChangePass({...changePass, newPassword:e.target.value})} placeholder='Enter New Password'></textarea>
                <button onClick={e => handlePassChange(e)}>Submit Change</button>
            </div>    

                <div className='mini-container'>
                <h3>Delete Account:</h3>
                <textarea onChange={e=>setDeletePass(...deletePass, e.target.value)} placeholder='Enter Password'></textarea>
                <button onClick={e => handleDelete(e)}>Submit Change</button>
            </div>
   
        </div>
    )

}