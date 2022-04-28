import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../css/AdminPanel.css"

const AdminPanel = () => {
    let navigate = useNavigate()

    return (
        <div className="container">
            <div className='search-wrapper'>
                <form>
                    <input type="text" className='user-search' placeholder='User search (not working at the moment)'/>
                </form>
            </div>
            <div className='function-wrapper'>
                <div className='requests' onClick={() => navigate("/admin/requests")}>
                    <div className="card-text">REQUESTS</div>
                </div>
                <div className='orders' onClick={() => navigate("/admin/orders")}>
                    <div className="card-text">ORDERS</div>                  
                </div>
            </div>
        </div>
    )
}

export default AdminPanel