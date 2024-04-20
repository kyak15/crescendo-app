
import React from 'react'
import albumpage from './albumpage.css'
import GenreComponent from './GenreComponenet'

export default function AlbumsPage(){

    const [genre, setGenre] = React.useState('indie+rock')
    const [trendingData, setTrendingData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)


    React.useEffect(()=>{
        async function getTrendingData(){
            console.log(genre)
            const dataCall = await fetch(`http://localhost:8000/api/getalbumpagedata/${genre}`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              },
              
            })

            const data = await dataCall.json()
        

            if(data.status !==200){
                setTrendingData([])
                setLoading(false)
            }
            else{
                
                setTrendingData(data.spotData)
                setLoading(false)
        
            }
        }
        getTrendingData()
    },[genre])
        
        if(loading){
            return <h1>Loading</h1>
        }

        else{
            return(
                <div className='albums-page-container'>
                    <div className='title-container'>
                        <h2 className='albums-page-title'>Trending Albums by Genre</h2>
                        <select value={genre} onChange={e => setGenre(e.target.value)}>
                                <option value='indie+rock'>Indie Rock</option>
                                <option value='hip-hop'>hip hop</option>
                                <option value='pop'>Pop</option>
                                <option value='rnb'>R&B</option>
                                <option value='electronic'>Electronic</option>
                        </select>
                    </div>
                    
                    <GenreComponent trendingData={trendingData} genre={genre}/>
                </div>
            ) 
        }

}

