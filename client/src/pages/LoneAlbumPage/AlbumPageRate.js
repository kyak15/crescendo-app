import React from 'react'
import lonealbum from './lonealbum.css'
import ReviewPopup from './ReviewPopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faHeart} from '@fortawesome/free-solid-svg-icons';
import dotenv from 'dotenv'
dotenv.config()

export default function AlbumPageRate(props){

    
    const [reviewData, setReviewData] = React.useState({
        rating: '',
        text:'',
    })

    

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
        
        const addListenCall = await fetch(`${process.env.REACT_APP_API_URL}/api/addfavorite/`,{
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

          if (addListenData.status === 500){
            return console.log('Album Already in User Fav Five!')
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
        const addListenCall = await fetch(`${process.env.REACT_APP_API_URL}/api/addlistenlist/`,{
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

    async function handleReviewSubmit(e){
        e.preventDefault()

        

        const reviewSubmission = {
            rating: reviewData.rating,
            text: reviewData.text,
            date: new Date(),
            albumID: props.data.id, 
            artistID: props.data.artists[0].id,
            albumName: props.data.name,
            artistName: props.data.artists[0].name,
            albumArt: props.data.images[0].url
        }
        
        const body = reviewSubmission
        const finalBody = JSON.stringify(body)
        
        const insertDataCall = await fetch(`${process.env.REACT_APP_API_URL}/api/addreview/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              "Content-Type": "application/json"
          },
          body:finalBody
          })
        
        const insertData = await insertDataCall.json()

        if(insertData.status !== 201){
            return console.log(`REVIEW NOT ADDED`)
        }
        
        alert('Album Added to Reviews!')
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
            <div className='popup-review-container'>
                    <form>
                        <h3>Rating:</h3>
                            <input
                                type='number'
                                min={1}
                                max={5}
                                onChange={e=>{setReviewData({...reviewData, rating: e.target.value})}}

                            />
                        
                        <h3 className='popup-title-review'>Review:</h3>
                            <input
                                type='text'
                                onChange={e=>{setReviewData({...reviewData, text: e.target.value})}}
                                className='review-textbox'
                            />
                        </form>
                        <button className='inner-submit-button' onClick={e=>{handleReviewSubmit(e)}}>Submit Review</button>
                </div>
            </div>

        </div>
    )
}