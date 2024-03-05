import React from 'react'
import profile from './profile.css'
import { useParams, NavLink } from 'react-router-dom'

export default function UserListenList(){

    const id = useParams().user

    const [listenList, setListenList] = React.useState([])


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
            
            if(listenData.status!==200){
                setListenList(null)
            }

            setListenList(listenData.listenListData.reverse())

            

        }
        getListenList()
    },[])

    return(
        <div className='listen-container'>
            <div className='title-container'>
                <h3 >{id} wants to listen to {listenList.length} Albums</h3>
            </div>

            <div className='listen-albums'>
                {listenList!==null?listenList.map(album=>{
                    return <NavLink to={`/albums/${album.albumname}`}><div className='listen-comp'>
                        <img src={album.albumart}/>

                    </div></NavLink>

                }):<p>Loading</p>}

            </div>
            
   

        </div>
    )
}