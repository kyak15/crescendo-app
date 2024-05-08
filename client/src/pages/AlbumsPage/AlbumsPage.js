
import React from 'react'
import albumpage from './albumpage.css'
import GenreComponent from './GenreComponenet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export default function AlbumsPage(){

    const [genre, setGenre] = React.useState('Indie Rock')
    const [trendingData, setTrendingData] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [activeSearch, setActiveSearch] = React.useState(false)
    const [userSearch, setUserSearch] = React.useState('')
    const [searchData, setSearchData] = React.useState(null)


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

    function handleActiveSearch(){
        console.log(activeSearch)
        activeSearch?setActiveSearch(false):setActiveSearch(true)
    }

    async function handleSearch(){
        const searchCall = await fetch(`http://localhost:8000/api/getusersearch/:${userSearch}`,{
            method: 'GET',
            credentials: 'include',
            headers: {
              "Content-Type": "application/json"
          }
        })

        const searchCallResponse = await searchCall.json()
        
   
        if(searchCallResponse.status !==200){
            return alert('Failure to Search for Albums')
        }

        // format for albums from api call == searchCallResponse.searchData.albums.items)
        console.log(searchCallResponse.searchData.albums.items)
        
        const searchElements = searchCallResponse.searchData.albums.items.map(album=>{
            if(album.album_type === 'album'){
                return(
                    <NavLink to={album.name}>
                        <div className='search-album-container'>
                            <img src={album.images[2].url}/>
                            <h3>{album.name}</h3>
                        </div>
                    </NavLink>)
            }

        })
        
        setSearchData(searchElements)
        

    }
    
    
        
        if(loading){
            return <h1>Loading</h1>
        }

        else{
            return(
                <div className='albums-page-container'>
                    <div className='title-container'>
                    
                    <FontAwesomeIcon 
                        className='search-icon'
                        icon={faMagnifyingGlass}
                        onClick={handleActiveSearch}
                        
                    />
                        <h2 className='albums-page-title'>Trending Albums in {genre}</h2>
                        <select value={genre} onChange={e => setGenre(e.target.value)}>
                                <option value='Indie Rock'>Indie Rock</option>
                                <option value='Hip-Hop'>hip hop</option>
                                <option value='Pop'>Pop</option>
                                <option value='Rnb'>R&B</option>
                                <option value='Electronic'>Electronic</option>
                                <option value='Rock'>Rock</option>
                                <option value='Jazz'>Jazz</option>
                                <option value='Alternative'>Alternative</option>

                        </select>

                    </div>

                    {
                        activeSearch?
                        <div className='search-container'>
                            <input
                                className='search-box'
                                type='text'
                                placeholder='Search for Albums Here!'
                                onChange={e => setUserSearch(e.target.value)}
                            />
                            <button onClick={handleSearch}>Search</button>

                        </div>
                        :null
                    
                    }
                    {
                        searchData && activeSearch?
                        <div className='result-container'>
                            {searchData}
                        </div>
                        :null
                    }
                    <GenreComponent trendingData={trendingData} genre={genre}/>
                </div>
            ) 
        }

}

