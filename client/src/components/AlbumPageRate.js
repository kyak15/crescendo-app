import React from 'react'
import ReviewPopup from './ReviewPopup'

export default function AlbumPageRate(props){

    const [reviewPP, setReviewPP] = React.useState(false)

    return(
        <div className='album-rate-container'>
            <h2>Add to Listen List or Review</h2>

            <div className='add-listenlist-container'>
                <button>Add to Listen List</button>
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