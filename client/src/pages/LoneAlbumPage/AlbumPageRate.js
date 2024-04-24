import React from 'react'
import lonealbum from './lonealbum.css'
import ReviewPopup from './ReviewPopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faHeart} from '@fortawesome/free-solid-svg-icons';

export default function AlbumPageRate(props){

    const [reviewPP, setReviewPP] = React.useState(false)

    console.log(props.data)

    async function addFavorite(e){
        e.preventDefault()
        const body = {
            albumID: props.data.id,
            artistID: props.data.artists[0].id,
            albumName: props.data.name,
            artistName: props.data.artists[0].name,
            albumArt: props.data.images[0].url
        }
        const finalBody = JSON.stringify(body)
        
        const addListenCall = await fetch(`http://localhost:8000/api/addfavorite/`,{
            method: 'POST',
            credentials: 'include',
            headers: {
              "Content-Type": "application/json"
          },
          body: finalBody
          })
        
          const addListenData = await addListenCall.json()

          if(addListenData.status === 400){
            return console.log('User Already has 5 favorites')
          }

          alert('Album Added to Fav Five!')

    }

    async function handleSubmit(e){
        e.preventDefault()
        const body = {
            albumID: props.data.id,
            artistID: props.data.artists[0].id,
            albumName: props.data.name,
            artistName: props.data.artists[0].name,
            albumArt: props.data.images[0].url,
            date: new Date()
        }
        const finalBody = JSON.stringify(body)
        const addListenCall = await fetch(`http://localhost:8000/api/addlistenlist/`,{
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
      },
      body: finalBody
      })

      const addListenData = await addListenCall.json()
      if(addListenData.status!== 201){
        return console.log('Failed to add to list')
      }

      alert(`Added to Listen List!`)

    }
    
    return(
        <div className='album-rate-container'>

            
            <h2 className='rate-top-title' >Interact:</h2>
            <p className='rate-instruct'>Add to your FavFive, Listen List, or Leave a Review</p>    
            
            <div className='add-container'>
                <button className='rate-button' onClick={e=>{addFavorite(e)}}><FontAwesomeIcon className='rate-icon' icon={faHeart} />Add to Fav Five</button>
            </div>
            
            <div className='add-container'>
                <button className='rate-button' onClick={e=>{handleSubmit(e)}}><FontAwesomeIcon className='rate-icon' icon={faPlus} />Add to Listen List</button>
            </div>

            <div className='add-container'>
                <button className='rate-button' onClick={()=>setReviewPP(true)}><FontAwesomeIcon className='rate-icon' icon={faPencil} />Add new Review</button>
                <ReviewPopup setTrigger={setReviewPP} trigger={reviewPP} data={props.data}>
                    <h1>my popup</h1>
                </ReviewPopup>
            </div>

        </div>
    )
}