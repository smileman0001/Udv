import axios from 'axios'
import React, { useEffect, useState } from 'react'

const OrdersPage = () => {
  let [requestsList, setRequestList] = useState(null)

  useEffect( () => {
    getRequestsList()
  }, [])
  
  let getRequestsList = async () => {
    let url = "http://localhost:8000/api/requests/"
    axios({
      method: "GET",
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => setRequestList(response.data))
    .catch(err => console.log("ERROR: ", err))
  }

  let rejectRequest = async (e) => {
    e.preventDefault()

    let index = e.target.rejected_comment.id
    let removed_request_id = requestsList[index]["request_id"]
    let newArr = requestsList.slice(0, index).concat(requestsList.slice(index + 1))

    setRequestList(newArr)
    
    const rejectData = async (request_id, comment) => {
      let url = "http://localhost:8000/api/requests/" + String(request_id) + "/"
      axios({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          "rejected_comment": comment
        })
      })
      .catch(err => console.log("ERROR: ", err))
    }

    rejectData(
      removed_request_id,
      e.target.rejected_comment.value)
    // getRequestsList()
  }

  let acceptRequest = async (e) => {
    e.preventDefault()
    
    let index = e.target.name
    let removed_request_id = requestsList[index]["request_id"]
    let newArr = requestsList.slice(0, index).concat(requestsList.slice(index + 1))

    setRequestList(newArr)

    const acceptData = async (request_id) => {
      let url = "http://localhost:8000/api/requests/" + String(request_id) + "/"
      axios({
        method: "DELETE",
        url: url,
        headers: {
          "Content-Type": "application/json"
        }
      })
      .catch(err => console.log("ERROR: ", err))
    }

    acceptData(removed_request_id)
  }

  return (
    <div className='container'>
      {requestsList ? <div className="requests-wrapper">
        {requestsList.map((request, index) => (
          <div className="requests-item">
            <h4>Request #{request["request_id"]}</h4>
            <p>User: {request["user_name"]}</p>
            <p>Activity: {request["activity_name"]}</p>
            <p>Comment: {request["comment"]}</p>
            <p>
              <input name={index} type="button" onClick={(e) => acceptRequest(e)} value="Accept!" />
            </p>
            <form onSubmit={(e) => rejectRequest(e)}>
                <textarea name="rejected_comment" id={index} placeholder='Write why you rejected the request'
                maxLength={250} rows={5} cols={40}></textarea>
                <input name={index} type="submit" value="Reject!" />
              </form>
          </div>
        ))}
      </div> : <> <p>
        Requests list in empty!  
      </p></>}
    </div>
  )
}

export default OrdersPage