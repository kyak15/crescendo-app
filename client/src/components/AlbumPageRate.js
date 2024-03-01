import React from 'react'
import ReviewPopup from './ReviewPopup'

export default function AlbumPageRate(props){

    const [reviewPP, setReviewPP] = React.useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        const body = {
            albumID: props.data.id,
            artistID: props.data.artists[0].id,
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
            <h2>Add to Listen List or Review</h2>

            <div className='add-listenlist-container'>
                <button onClick={e=>{handleSubmit(e)}}>Add to Listen List</button>
            </div>

            <div className='add-review-container'>
                <h3>Review Album</h3>
                <button onClick={()=>setReviewPP(true)}>Add new Review</button>
                <ReviewPopup setTrigger={setReviewPP} trigger={reviewPP} data={props.data}>
                    <h1>my popup</h1>
                </ReviewPopup>
            </div>

        </div>
    )
}