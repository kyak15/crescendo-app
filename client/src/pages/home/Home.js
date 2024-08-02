import React from 'react'
import { NavLink } from 'react-router-dom';
import home from './home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faHeart, faPencil, faStar, faBook, faUserGroup} from '@fortawesome/free-solid-svg-icons';
const apiURL = process.env.REACT_APP_API_URL

export default function Home(){

    const [homeData, setHomeData] = React.useState(null)

    React.useEffect(()=>{
        async function getClassicAlbums(){
            const albumCall = await fetch(`${apiURL}/api/gethomealbums/`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json"
              }
              })

              const albumData = await albumCall.json()
              if(albumData.status !== 200){
                setHomeData([])
              }else{
                setHomeData(albumData)
              }
            
              
        }
        getClassicAlbums()
    },[])

    

    
    

    return(
        <div className='home-container'>

            <div className='home-title-container'>
                <h3>The social network for music lovers </h3>
                <h3>Track albums you've listened to</h3>
                <h3>Save those you heard</h3>
                <h3>Review and tell your friends</h3>
                <NavLink to='/signup'>Sign up and start!</NavLink>
            </div>

        
            <div className='home-features-container'>
                <div className='feature-container'>
                    <FontAwesomeIcon className='icon' icon={faCheck} />
                    <p>Keep track of every album you've ever listened to</p>
                </div>

                <div className='feature-container'>
                    <FontAwesomeIcon className='icon' icon={faHeart}/>
                    <p>Show love for your favorite albums by creating a Favorite Five</p>
                </div>

                <div className='feature-container'>
                    <FontAwesomeIcon className='icon' icon={faPencil} />
                    <p>Write reviews for your favorite albums</p>
                </div>

                <div className='feature-container'>
                    <FontAwesomeIcon className='icon' icon={faStar} />
                    <p>Rate each album on a 5 star rating</p>
                </div>

                <div className='feature-container'>
                <FontAwesomeIcon className='icon' icon={faBook} />
                    <p>Keep a listen list of albums you plan on listening to</p>
                </div>

                <div className='feature-container'>
                    <FontAwesomeIcon className='icon' icon={faUserGroup} />
                    <p>Follow your friends and share albums and reviews with them</p>
                </div>
            </div>
            <h3 className='popular-title'>Check Out and Review These Classics!</h3>
            <div className='home-popular-container'>
         
                <div className='popular-container'>
                    {homeData!==null&&homeData.length!==0?homeData.homeData.map(album=>{
                        
                        return(
                            <div className='album-container'>
                                <NavLink to={`/albums/${album.albums.items[0].name}`}><img src={album.albums.items[0].images[0].url}/></NavLink>
                                <h3>{album.albums.items[0].name}</h3>
                            </div>
                        )
                    }):console.log('fail')}
                </div>
            
                
            </div>
        </div>
        
        
    )
}