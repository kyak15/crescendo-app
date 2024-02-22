import React from 'react'

export default function Home(props){



    return(
        
        <h1>{localStorage.getItem('user')?`logged in`: 'not logged in'}</h1>
        
    )
}