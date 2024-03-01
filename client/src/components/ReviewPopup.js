import React from 'react'

export default function ReviewPopup(props){

    const [reviewText, setReviewText] = React.useState('')
    const [reviewData, setReviewData] = React.useState({
        albumID: '',
        artistID: '',
        rating: '',
        text:'',
        date: new Date()
    })

    async function handleSubmit(e){
        e.preventDefault()
        setReviewData({...reviewData, albumID: props.data.id, artistID: props.data.artists[0].id})
        const body = reviewData
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
                        <button className='inner-submit-button' onClick={e=>{handleSubmit(e)}}>Submit Review</button>
                </div>

            </div>
        </div>
    ): ''
}