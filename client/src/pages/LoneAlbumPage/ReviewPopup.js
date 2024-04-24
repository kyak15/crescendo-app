import React from 'react'
import lonealbum from './lonealbum.css'

export default function ReviewPopup(props){

    
    const [reviewData, setReviewData] = React.useState({
        rating: '',
        text:'',
    })

    async function handleSubmit(e){
        e.preventDefault()

        console.log(props.data)

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
        console.log(`final: ${finalBody}`)
        const insertDataCall = await fetch('http://localhost:8000/api/addreview/', {
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

    

    return (props.trigger)? (
        <div className='popup'>
            <div className='popup-inner'>
                <div className='popup-info'>
                    <h3>Add Review:</h3>
                    <img src={props.data.images[0].url}/>
                    {<h4>{props.data.artists[0].name}</h4>}
                    <h4>{props.data.name}</h4>                    
                </div>

                <button className='popup-inner-close-button' onClick={()=>props.setTrigger(false)}>Close</button>


            </div>
        </div>
    ): ''
}