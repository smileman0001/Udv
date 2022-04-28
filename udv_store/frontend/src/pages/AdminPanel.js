import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
    let navigate = useNavigate()

    return (
        <>
            <div className='form-wrapper'>
                <form>
                    <input type="text" className='user-search' placeholder='User search (not working at the moment)'/>
                </form>
            </div>
            <div className='function-wrapper'>
                <div className='requests' onClick={() => navigate("/admin/requests")}>
                    REQUESTS
                </div>
                <div className='orders' onClick={() => navigate("/admin/orders")}>
                    ORDERS
                </div>
            </div>
        </>
    )
}

export default AdminPanel