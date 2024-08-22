import React, { useState } from 'react';
import api from '../api/axiosConfig';
import './Shop.css';
import Cookies from 'js-cookie';
import ProductModal from './ProductModal';
import Hero from './Hero';

function Shop({ products, loggedInUser, setLoggedInUser }) {
    const [modalShow, setModalShow] = useState(false);

    const handleProductClick = (product) => {
        setProduct(product);
        setModalShow(true);
    };

    const handleAddToCart = (product) => {
        const userId = loggedInUser.userId;
        let existingCart = loggedInUser.cart ? JSON.parse(loggedInUser.cart) : [];

        let productExists = false;

        if (existingCart) {
            existingCart.forEach(item => {
                if (item.productId === product.productId) {
                    productExists = true;
                }
            });
        }


        if (!productExists) {
            existingCart.push({
                "productId": product.productId,
                "customizations": "",
                "quantity": 1,
                "total": product.price
            });
        } else {
            existingCart = existingCart.filter(item => item.productId !== product.productId);
        }


        api.put(`/user/updateUserCart/${userId}`, {
            "cart": JSON.stringify(existingCart)
        })
            .then(function (response) {
                if (response.status === 200) {
                    let user = response.data;
                    Cookies.set('user', JSON.stringify(user));
                    setLoggedInUser(user);
                } else {
                    // Todo
                }
            })
            .catch(function (error) {
                setLoggedInUser(null);
                console.error('Error updating cart:', error);
            });
    }


    const [product, setProduct] = useState();




    return (
        <>
            <div className={`app-container`}>
                <div className="main-content">
                <Hero></Hero>
                    <div className="untree_co-section product-section before-footer-section">
                        <div className="container">
                            <div className="row">

                                {
                                    products && products.length > 0 ? (
                                        products?.map((p) => {
                                            return (
                                                <div key={p.productId} className="col-12 col-md-4 col-lg-3 mb-5">
                                                    <a className="product-item" href="#" onClick={(e) => { e.preventDefault(); handleProductClick(p); }}>
                                                        {/* <img src="/images/product-3.png" className="img-fluid product-thumbnail" /> */}
                                                        <img src={`http://localhost:8080/${p.displayImage}`} alt={p.category} className="img-fluid" />
                                                        <h3 className="product-title">{p.name}</h3>
                                                        <strong className="product-price">&#8377; {p.price}</strong>


                                                        {loggedInUser && (
                                                            <span className="icon-cross">
                                                                <img
                                                                    src={
                                                                        loggedInUser.cart &&
                                                                            JSON.parse(loggedInUser.cart).some(item => item.productId === p.productId)
                                                                            ? "/images/minus.svg"
                                                                            : "/images/cross.svg"
                                                                    }
                                                                    className={`img-fluid ${loggedInUser.cart &&
                                                                        JSON.parse(loggedInUser.cart).some(item => item.productId === p.productId)
                                                                        ? 'minus-icon'
                                                                        : 'cross-icon'
                                                                        }`}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleAddToCart(p);
                                                                    }}
                                                                />
                                                            </span>
                                                        )}

                                                    </a>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div>
                                            Loading products...
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <ProductModal
                            product={product}
                            handleAddToCart={handleAddToCart}
                            loggedInUser={loggedInUser}
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                    </div>
                </div>

            </div>
        </>
    );
}

export default Shop;
