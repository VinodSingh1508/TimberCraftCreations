import Hero from './Hero';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import api from '../api/axiosConfig';

function Cart({ products, loggedInUser, setLoggedInUser }) {

    const [productList, setProductList] = useState([]);
    const [overallCart, setOverallCart] = useState({ "subTotal": 0.00, "total": 0.00 });

    useEffect(() => {
        let newOverallCart = { "subTotal": 0.00, "total": 0.00 };
        productList.forEach(item => {
            newOverallCart.subTotal = newOverallCart.subTotal + item.total;
            newOverallCart.total = newOverallCart.total + item.total;
        });
        setOverallCart(newOverallCart);
    }, [productList]);

    useEffect(() => {
        let finalProducts = [];
        JSON.parse(loggedInUser.cart).map((cartItem, index) => {
            let item = products?.find(item => item.productId === cartItem.productId);
            if (item) {
                item.quantity = cartItem.quantity;
                item.customizations = cartItem.customizations;
                item.total = item.price*cartItem.quantity;
                finalProducts.push(item);
            }
        })
        setProductList(finalProducts);
    }, []);


    const increment = (prodId, price) => {
        setProductList((prevProductList) =>
            prevProductList.map(product =>
                product.productId === prodId
                    ? { ...product, quantity: product.quantity + 1, total: (product.quantity + 1) * price }
                    : product
            ));

        let existingCart = loggedInUser.cart ? JSON.parse(loggedInUser.cart) : [];
        let index = existingCart.findIndex(item => item.productId === prodId);

        if (index !== -1) {
            existingCart[index].quantity = existingCart[index].quantity + 1;
            existingCart[index].total = (existingCart[index].quantity) * price;
            updateUserCart(existingCart);
        }
    }

    const decrement = (prodId, price) => {
        setProductList((prevProductList) =>
            prevProductList.map(product =>
                product.productId === prodId
                    ? { ...product, quantity: Math.max(product.quantity - 1, 1), total: (Math.max(product.quantity - 1, 1)) * price }
                    : product
            ));

        let existingCart = loggedInUser.cart ? JSON.parse(loggedInUser.cart) : [];
        let index = existingCart.findIndex(item => item.productId === prodId);

        if (index !== -1) {
            existingCart[index].quantity = existingCart[index].quantity - 1;
            existingCart[index].total = (existingCart[index].quantity) * price;
            updateUserCart(existingCart);
        }
    }

    const removeProduct = (prodId) => {
        setProductList((prevProductList) =>
            prevProductList.filter(product =>
                product.productId !== prodId
            ));

        let existingCart = loggedInUser.cart ? JSON.parse(loggedInUser.cart) : [];
        existingCart = existingCart.filter(item => item.productId !== prodId);
        updateUserCart(existingCart);
    }
    const handleCustomizations = (e, prodId) => {
        const { value } = e.target;
        setProductList((prevProductList) =>
            prevProductList.map(product =>
                product.productId === prodId
                    ? { ...product, customizations: value }
                    : product
            ));

        let existingCart = loggedInUser.cart ? JSON.parse(loggedInUser.cart) : [];
        let index = existingCart.findIndex(item => item.productId === prodId);

        if (index !== -1) {
            existingCart[index].customizations = value;
            updateUserCart(existingCart);
        }

    }

    const updateUserCart = (existingCart) => {
        api.put(`/user/updateUserCart/${loggedInUser.userId}`, {
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

    return (
        <>

            <Hero></Hero>
            {productList && productList.length > 0 &&
                <div className="untree_co-section before-footer-section">
                    <div className="container">
                        <div className="row mb-5">
                            <form className="col-md-12">
                                <div className="site-blocks-table">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="product-thumbnail">Image</th>
                                                <th className="product-name">Product</th>
                                                <th className="product-price">Price</th>
                                                <th className="product-quantity">Quantity</th>
                                                <th className="product-customizations">Customizations</th>
                                                <th className="product-total">Total</th>
                                                <th className="product-remove">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productList.map((product, index) => {

                                                return (
                                                    <tr>
                                                        <td className="product-thumbnail">
                                                            <img src={`http://localhost:8080/${product.displayImage}`} alt="Image" className="img-fluid" />
                                                        </td>
                                                        <td className="product-name">
                                                            <h2 className="h5 text-black">{product.name}</h2>
                                                        </td>
                                                        <td>&#8377; {product.price}</td>
                                                        <td>
                                                            <div className="input-group mb-3 d-flex align-items-center quantity-container" style={{ maxWidth: "120px" }}>
                                                                <div className="input-group-prepend">
                                                                    <button className="btn btn-outline-black decrease" type="button" disabled={product.quantity <= 1} onClick={() => decrement(product.productId, product.price)}>-</button>
                                                                </div>
                                                                <input type="text" className="form-control text-center quantity-amount" value={product.quantity} placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                                                                <div className="input-group-append">
                                                                    <button className="btn btn-outline-black increase" type="button" onClick={() => increment(product.productId, product.price)}>+</button>
                                                                </div>
                                                            </div>

                                                        </td>
                                                        <td>
                                                            <textarea className="form-control" name="customizations" onChange={(event) => handleCustomizations(event, product.productId)} cols="30" rows="5">{product.customizations}</textarea>
                                                        </td>
                                                        <td>&#8377; {product.total}</td>

                                                        <td><button className="btn btn-outline-black increase" type="button" onClick={() => removeProduct(product.productId)}>X</button></td>
                                                    </tr>
                                                );
                                            })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="text-black h4" htmlFor="coupon">Coupon</label>
                                        <p>If you have a coupon, you will be able to apply it during checkout.</p>
                                        <p>Register to our news letters to get coupons from time to time.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 pl-5">
                                <div className="row justify-content-end">
                                    <div className="col-md-7">
                                        <div className="row">
                                            <div className="col-md-12 text-right border-bottom mb-5">
                                                <h3 className="text-black h4 text-uppercase">Cart Totals</h3>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <span className="text-black">Subtotal</span>
                                            </div>
                                            <div className="col-md-6 text-right">
                                                <strong className="text-black">&#8377; {overallCart.subTotal}</strong>
                                            </div>
                                        </div>
                                        <div className="row mb-5">
                                            <div className="col-md-6">
                                                <span className="text-black">Total</span>
                                            </div>
                                            <div className="col-md-6 text-right">
                                                <strong className="text-black">&#8377; {overallCart.total}</strong>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <Link to={`/checkout`} className="btn btn-black btn-lg py-3 btn-block">
                                                Proceed To Checkout
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {!productList &&
                <span>Your cart is empty</span>
            }


        </>
    );
}

export default Cart;
