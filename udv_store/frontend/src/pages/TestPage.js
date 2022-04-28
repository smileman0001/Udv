import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const TestPage = () => {
    let {user, cart} = useContext(AuthContext)
    
    return (
        <>
            <div>TestPage</div>
            <div>
                Cart: { cart !== null ?
                <i>not null</i> :
                <b>is null</b> }
            </div>  
            <div>
                User: { user !== null ?
                <i>not null</i> :
                <b>is null</b> }
            </div>
        </>
    )
}

export default TestPage