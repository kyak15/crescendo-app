import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'

export default function Layout(props){
    return(
        <div>
            <Header user={props.user} />
            <Outlet/>
        </div>

    )
}