import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

import UcoinIcon from '../svgs/UcoinIcon'
import "../css/componentStyle/Marketplace.css"


const Marketplace = () => {
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

    const chunks = (arr, size) => 
        Array.from(
            new Array(Math.ceil(arr.length / size)),
            (_, i) => arr.slice(i * size, i * size + size)
        );
    
    return (
        <div className='marketplace'>
            <div className="title">
                <ul>
                    <li><span className="category">Все товары</span></li>
                    <li><span className="category">Футболки</span></li>
                    <li><span className="category">Кружки</span></li>
                    <li><span className="category">Аксессуары</span></li>
                </ul>
            </div>
            <div className='products-wrapper'>
                {/* {chunks(productsList, 3).map(chunck => (
                    <div className='products-row'>
                        {chunck.map(product => (
                            <Link className='link-extended' to={"/store/" + String(product.product_id)}>
                                <div className='product-card'>
                                    <div className="product-card-img">
                                        <img src="" alt="*Here product image*"></img>
                                    </div>
                                    <div className='product-card-info'>
                                        <div className='product-card-name'>{product["name"]}</div>
                                        <div className='product-card-price'>
                                            {product["price"]} 
                                            <UcoinIcon width={20} height={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>  
                ))} */}
                {productsList ? <>
                    {productsList.map(product => (
                        <Link className='link-extended' to={"/store/" + String(product.product_id)}>
                            <div className='product-card'>
                                <div className="product-card-img">
                                    <img src="" alt="*Here product image*"></img>
                                </div>
                                <div className='product-card-info'>
                                    <div className='product-card-name'>{product["name"]}</div>
                                    <div className='product-card-price'>
                                        {product["price"]} 
                                        <UcoinIcon width={20} height={20} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </> : <></>}
            </div>
        </div>
    ) 
}

export default Marketplace