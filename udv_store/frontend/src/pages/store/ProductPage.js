import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import "../../css/ProductPage.css"
import UcoinIcon from '../../svgs/UcoinIcon'

const ProductPage = () => {
    let {productId} = useParams()
    let {authTokens} = useContext(AuthContext)
    let [product, setProduct] = useState({})
    let navigate = useNavigate()

    useEffect( () => {
        getProductInfo()
    }, [])

    let getProductInfo = () => {
        axios({
            method: "GET",
            url: "http://localhost:8000/api/products/" + String(productId) + "/",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            }
        })
        .then(response => setProduct(response.data))
        .catch(err => console.log("ERROR: ", err))
    }

    let changeCount = (e) => {
        e.preventDefault()
        let newData = {...product}
        let count = 1
        if (e.target.value !== "Buy") {
            count = Number(e.target.value)
        } 
        newData.count = count
        
        setProduct(newData)

        const fetchData = async (product_id, new_count) => {
            let url = "http://localhost:8000/api/get-cart/"
            await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authTokens.access)
                },
                body: JSON.stringify({
                    "product_id": product_id,
                    "count": new_count
                })
            })
            .catch(err => console.log("ERROR: ", err))
        }

        fetchData(product.product_info.product_id, count)
    }

    return (
        <>
        <div className='container'>
            <h4>Product Page by id: {productId}</h4>
            <div className="product-wrapper">
                <div className="product-image">
                    <img src="" alt="Here product image" />
                </div>
                <div className="product-info">
                    {product["product_info"] ? 
                    <>
                        <p> Name: {product.product_info.name}</p>
                        <p> Description: {product.product_info.description}</p> 
                        <p> Price: {product.product_info.price} <UcoinIcon width={20} height={20} /></p> 
                    </> :
                    <p>No info!</p>}
                    <form>
                        {product["count"] ? <>
                            <input type="number" max={10} min="1" name="product_count" 
                            value={product["count"]} onChange={(e) => changeCount(e)} />
                            <input className="button" type="button" value="Order!" onClick={(e) => navigate("/cart") }/>
                        </> : <>
                            <input className='button' type="button" name="buy_button" value="Buy" onClick={(e) => changeCount(e)} />
                        </>}
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default ProductPage