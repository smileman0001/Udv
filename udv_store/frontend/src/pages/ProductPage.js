import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import "../css/ProductPage.css"

const ProductPage = () => {

    let navigate = useNavigate()
    let {user, authTokens} = useContext(AuthContext)
    let {productId} = useParams()

    let [product, setProduct] = useState({})

    useEffect( () => {
        getProductInfo()
    }, [])

    let getProductInfo = async () => {
        let url = "http://localhost:8000/api/products/" + String(productId) + "/"
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        let data = await response.json()

        if (response.status === 200) {
            setProduct(product = data)
        }
    }

    let addToCart = async (e) => {
        e.preventDefault()
        let url = "http://localhost:8000/api/add-to-cart/"
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + String(authTokens.access)
            },
            body: JSON.stringify({
                user_id: user.user_id,
                product_id: productId,
                count: e.target.product_count.value
            })
        })
        let data = await response.json()

        if (response.status === 200) {
            console.log("Product added!")
            navigate("/store")
        } else {
            alert("Smt went wrong!")
        }
        // console.log(e.target.product_count.value)

    }

    return (
        <>
            <h4>Product Page by id: {productId}</h4>
            <div className="product-wrapper">
                <div className="product-image">
                    <img src="" alt="Here product image" />
                </div>
                <div className="product-info">
                    <p>{product.name}</p>
                    <p>{product.category}</p>
                    <p>Price: {product.price}</p>
                    <p>Description: {product.description}</p>
                    <form onSubmit={addToCart}>
                        <input type="number" max={10} min="1" step={1} name="product_count" />
                        <input type="submit" value="Add to cur cart" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProductPage