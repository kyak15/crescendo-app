import React from 'react'
import { useParams } from 'react-router-dom'

export default function UserListenList(){

    const id = useParams().user
    console.log(id)

    React.useEffect(()=>{
        async function getListenList(){
            const listenCall = await fetch(`http://localhost:8000/api/${id}/listenlist/`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
            })

            const listenData = await listenCall.json()
            console.log(listenData)
            

        }
        getListenList()
    },[])

    return(
        <h1>User Listen List Page</h1>
    )
}