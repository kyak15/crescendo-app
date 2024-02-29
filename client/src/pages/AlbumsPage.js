
import React from 'react'
import GenreComponent from '../components/GenreComponenet'
const genres = [    "indie+rock",
"hip-hop",
"pop",
"rnb",
"electronic"]

export default function AlbumsPage(){
    const [trendingData, setTrendingData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [genreCards, setGenreCards] = React.useState([])


    async function handle(data){
        console.log(`here @ handle`)
       let cards = []
        for(let i=0; i<4, i++;){
            cards = data[i][genres[i]].map(item =>{
                return (<GenreComponent trendingGenre={data[i][genres[i]]} genreName = {genres[i]} />)
            })
        }
        return cards
        
    }

    React.useEffect(()=>{
        async function getTrendingData(){
            const dataCall = await fetch('http://localhost:8000/api/getalbumpagedata/',{
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              }
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
    },[])
        
        if(loading){
            return <h1>Loading</h1>
        }else{
    
            return(
                <div className='albums-page-container'>
                    <h2 className='albums-page-title'>Popular Albums by Genres</h2>
                    <div className='albums-page-genres-container'>
                        <GenreComponent trendingData={trendingData[0]['indie+rock']} genre='Indie Rock' />
                        <GenreComponent trendingData={trendingData[1]['hip-hop']} genre='Hip-Hop' />
                        <GenreComponent trendingData={trendingData[2]['pop']} genre='Pop' />
                        <GenreComponent trendingData={trendingData[3]['rnb']} genre='R&B' />
                        <GenreComponent trendingData={trendingData[4]['electronic']} genre='Electronic' />
                    </div>

                </div>

            ) 
                
            
        }

}

