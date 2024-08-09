import React from 'react'
import lonealbum from './lonealbum.css'
import ReviewPopup from './ReviewPopup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPencil, faHeart} from '@fortawesome/free-solid-svg-icons';
const apiURL = process.env.REACT_APP_API_URL

export default function AlbumPageRate(props){

    
    const [hover, setHover] = React.useState(0);   // Current hovered rating
    const [reviewData, setReviewData] = React.useState({
        rating: {},
        text:'',
    })

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
          const fullStarValue = index + 1;
          const halfStarValue = index + 0.5;
    
          return (
            <span
              key={index}
              onMouseEnter={() => setHover(halfStarValue)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setReviewData({...reviewData, rating: hover})}

              
              
              style={{
                cursor: 'pointer',
                fontSize: '3rem',
                margin: '0 0.1rem',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              {/* Half Star */}
              <span
                style={{
                  color: (hover >= halfStarValue || reviewData.rating >= halfStarValue) ? '#ffc107' : '#e4e5e9',
                  position: 'absolute',
                  width: '50%',
                  overflow: 'hidden',
                }}
                onMouseEnter={() => setHover(halfStarValue)}
              >
                ★
              </span>
              {/* Full Star */}
              <span
                style={{
                  color: (hover >= fullStarValue || reviewData.rating >= fullStarValue) ? '#ffc107' : '#e4e5e9',
                }}
                onMouseEnter={() => setHover(fullStarValue)}
              >
                ★
              </span>
            </span>
          );
        });
      };

    

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
        
        const addListenCall = await fetch(`${apiURL}/api/addfavorite/`,{
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
        const addListenCall = await fetch(`${apiURL}/api/addlistenlist/`,{
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
        
        const insertDataCall = await fetch(`${apiURL}/api/addreview/`, {
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
                        
                        {renderStars()}
          
                        
                        <h3 className='popup-title-review'>Review:</h3>
                            <textarea
                                
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