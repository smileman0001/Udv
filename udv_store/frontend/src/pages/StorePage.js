import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Cart from '../components/Cart'
import "../css/StorePage.css"

const StorePage = () => {

    let [productsList, setProductsList] = useState([])


    useEffect( () => {
        getProductsList()
    }, [])

    let getProductsList = async () => {
        let url = "http://localhost:8000/api/products/"
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        let data = await response.json()

        if (response.status === 200 ) {
            setProductsList(productsList = data)
        } else {
            alert("Something went wrong!")
        }
    }

    return (
        <>
            <h2 className='center-text'>Store Page</h2>
            <div className='banner-wrapper'>
                <div className='big-black-banner'></div>
            </div>
            <div className='products-list-wrapper'>
                <div className='products-list'>
                    {productsList.map(product => (
                        <Link className='link-extended' to={"/store/" + String(product.product_id)}>
                            <div className='store-item'>
                                <img src="" alt="*Here product image*"></img>
                                <p>Name: {product.name}</p>
                                <p>Price: {product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='cart-wrapper'>
                    <Cart />
                </div>
            </div>
        </>
    )
}

export default StorePage