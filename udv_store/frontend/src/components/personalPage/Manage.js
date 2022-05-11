import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import RequestCreate from '../popup/RequestCreate'
import RequestHistory from '../popup/RequestHistory'
import OrderHistory from '../popup/OrderHistory'


const Manage = () => {
  const {authTokens} = useContext(AuthContext)
  const [userRequests, setUserRequests] = useState(null)
  const [userOrders, setUserOrders] = useState(null)
  const [userPresents, setUserPresents] = useState(null)
  const [popupIsOpen, setPopupIsOpen] = useState({
    "request-create": false,
    "request-history": false,
    "order-history": false,
  })

  useEffect(() => {
    getUserRequests("request");
    getUserRequests("order");
  }, [])

  const getUserRequests = async (param) => {
    let url = "http://localhost:8000/api/userhistory/" + param + "/"
    axios({
      method: "GET",
      url: url,
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + String(authTokens.access)
      }
    })
    .then(response => {
        if (response.status === 200) {
          if (param === "request") {
            setUserRequests(response.data)
          }
          if (param === "order") {
            setUserOrders(response.data)
          }
          if (param === "order") {
            setUserPresents(response.data)
          }
        } 
    })
    .catch(err => console.log("ERROR: ", err))
  }

  const togglePopup = (popup) => {
    let newArr = {...popupIsOpen}
    newArr[popup] = !popupIsOpen[popup]
    setPopupIsOpen(newArr)
  }

  return (
    <div className='manage-wrapper'>
        <div className='requests-wrapper'>
          {userRequests ? <>

            <div className='request-new' style={{flex: 1}}>
              <input type="button" value="Новый запрос" 
              onClick={() => togglePopup("request-create")}/>
            </div>

            <div className='request-history' style={{flex: 2}}>
              {userRequests.length > 0 ? <>
                {userRequests.map(request => (
                  <div style={{border: "1px dotted brown"}}>
                    <Link to="#">Request #{request.request_id}</Link> <br/> state is {request.state}
                  </div>
               ))}
              </> : <p>List is empty!</p>}
            </div>

            <div className='request-full-history' style={{flex: 1}}>
              <input type="button" value="Смотреть все предыдущие заявки" 
              onClick={() => togglePopup("request-history")} />
            </div>

          </> : <><p>Some troubles with requests history!</p></>}
        </div>

        <div className='orders-wrapper'>
          {userOrders ? <>

            <div className='order-history' style={{flex: 3}}>
              {userOrders.length > 0 ? <>
                  {userOrders.map(order => (
                    <div style={{border: "1px dotted brown"}}>
                      <Link to="#">Order #{order.id}</Link> <br/> state is {order.state}
                    </div>
                ))}
                </> : <p>List is empty!</p>}
            </div>

            <div className='order-full-history' style={{flex: 1}}>
              <input type="button" value="Смотреть все предыдущие заказы" 
                onClick={() => togglePopup("order-history")} />
            </div>

          </> : <><p>Some troubles with orders history!</p></>}
          </div>

        <div className='presents-wrapper'>
          {userPresents ? <>
          
          </> : <><p>Some troubles with presents history!</p></>}
      </div>

      {popupIsOpen['request-create'] && <RequestCreate handleClose={() => {
        togglePopup('request-create');
        getUserRequests("request");
      }} />}
      {popupIsOpen['request-history'] && <RequestHistory handleClose={() => togglePopup('request-history')} />}
      {popupIsOpen['order-history'] && <OrderHistory handleClose={() => togglePopup('order-history')} />}

    </div>
  )
}

export default Manage