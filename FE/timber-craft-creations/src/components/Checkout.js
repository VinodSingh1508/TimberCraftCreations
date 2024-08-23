import Hero from "./Hero";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../api/axiosConfig';
import Cookies from 'js-cookie';

function Checkout({ products, loggedInUser, setLoggedInUser }) {
    const [billingData, setBillingData] = useState({ "fName": "", "lName": "", "add1": "", "add2": "", "landmark": "", "country": "India", "state": "", "postalCode": "", "email": "", "phone": "", "notes": "" });
    const [billingError, setBillingError] = useState({});
    const [orderDetails, setOrderDetails] = useState({});
    const [coupon, setCoupon] = useState("");
    const [couponError, setCouponError] = useState("");
    const [paymentError, setPaymentError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        setOrderDetails(getInitialOrderDetails());
        console.log({ loggedInUser });
        if (loggedInUser) {
            let nameParts = (loggedInUser.userName).split(" ");
            let firstName = nameParts[0];
            let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
            setBillingData({ ...billingData, fName: firstName, lName: lastName, email: loggedInUser.email, phone: loggedInUser.phone })
        }
    }, []);

    const getInitialOrderDetails = () => {
        let finalProducts = [];
        let orderDetails = {};
        let subTotal = 0.00;
        JSON.parse(loggedInUser.cart).map((cartItem, index) => {
            let item = products?.find(item => item.productId === cartItem.productId);
            finalProducts.push({ ...cartItem, name: item.name });
            subTotal += cartItem.total;
        });
        orderDetails.products = finalProducts;
        orderDetails.subTotal = subTotal;
        orderDetails.total = subTotal;
        orderDetails.discount = 0.00;
        orderDetails.coupon = "";
        return orderDetails;
    }

    const validateCoupon = () => {
        api.post('/coupons/validate', {
            couponId: coupon,
            userId: loggedInUser.userId,
            cartValue: orderDetails.subTotal
        })
            .then(function (validationResponse) {
                if (validationResponse.data.status === 'valid') {
                    const details = validationResponse.data.details.split("~");
                    let discount = 0.00;
                    if (details[0] === "Flat") {
                        discount = parseFloat(details[1]);
                    } else {
                        discount = (parseFloat(details[1]) * orderDetails.subTotal) / 100;
                    }
                    const updatedOrderDetails = {
                        ...orderDetails,
                        discount: discount,
                        total: orderDetails.subTotal - discount,
                        coupon: coupon
                    };
                    setOrderDetails(updatedOrderDetails);
                    setCouponError("");
                } else {
                    setCouponError(validationResponse.data.error);
                    setOrderDetails(getInitialOrderDetails());
                }
            })
            .catch(function (error) {
                setCouponError('Error validating coupon');
                setOrderDetails(getInitialOrderDetails());
            });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setBillingData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const validateBillingData = () => {

        let isValid = true;
        let newErrors = {};

        if (!billingData.fName.trim()) {
            newErrors.fName = 'First Name is required';
            isValid = false;
        }

        if (!billingData.lName.trim()) {
            newErrors.lName = 'Last Name is required';
            isValid = false;
        }

        if (!billingData.add1.trim()) {
            newErrors.add1 = 'Address line 1 is required';
            isValid = false;
        }

        if (!billingData.add2.trim()) {
            newErrors.add2 = 'Address line 2 is required';
            isValid = false;
        }

        if (!billingData.state.trim()) {
            newErrors.state = 'State is required';
            isValid = false;
        }

        if (!billingData.postalCode.trim()) {
            newErrors.postalCode = 'Zip code is required';
            isValid = false;
        } else if (!/^\d{6}$/.test(billingData.postalCode.trim())) {
            newErrors.postalCode = 'Invalid zip code';
            isValid = false;
        }

        if (!billingData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.email.trim())) {

            newErrors.email = 'Invalid email';
            isValid = false;
        }

        if (!billingData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(billingData.phone.trim())) {

            newErrors.phone = 'Invalid Phone';
            isValid = false;
        }
        if (!isValid)
            setBillingError(newErrors);
        else
            setBillingError({})
        return isValid;
    }

    const handleOrder = async (event) => {
        if (validateBillingData()) {

            const { data: { key } } = await api.get("/payment/getKey");

            const  resp = await api.post("/payment/createOrder", {
                "amount": orderDetails.total * 100
            })
            console.log(resp.data);
            const options = {
                key,
                amount: orderDetails.total*100,
                currency: "INR",
                name: "Timber-Craft Creations",
                description: "Order ID: " + resp.data.id,
                image: "http://localhost:8080/logo.png",
                order_id: resp.data.id,
                //callback_url: "http://localhost:8080/payment/verify",
                prefill: {
                    name: loggedInUser.userName,
                    email: loggedInUser.email,
                    contact: "+91" + loggedInUser.phone
                },
                notes: {
                    "address": "Razorpay Corporate Office"
                },
                theme: {
                    "color": "#121212"
                },
                handler: function (response) {
                    api.post("http://localhost:8080/payment/verify", {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            createOrder(response.data);
                            setPaymentError("");
                        })
                        .catch(error => setPaymentError("Payment failed for order ID: " + resp.data.id));
                }
            };
            const razor = new window.Razorpay(options);
            razor.open();
        }

    };

    const createOrder = (data) => {
        let orderItems = [];
        console.log({ orderDetails });
        orderDetails.products.forEach(item => {
            orderItems.push({
                product: {
                    productId: item.productId
                },
                customization: item.customizations,
                quantity: item.quantity
            });
        });

        const payload = {
            subTotal: orderDetails.subTotal,
            total: orderDetails.total,
            discount: orderDetails.discount,
            coupon,
            razorpayPaymentId: data.razorpayPaymentId,
            razorpaySignature: data.razorpaySignature,
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentStatus: "Completed",
            orderItems,
            orderAddress: {
                firstName: billingData.fName,
                lastName: billingData.lName,
                addressLine1: billingData.add1,
                addressLine2: billingData.add2,
                landmark: billingData.landmark,
                country: billingData.country,
                state: billingData.state,
                postalCode: billingData.postalCode,
                email: billingData.email,
                phone: billingData.phone,
                notes: billingData.notes
            }
        }        

        api.post(`http://localhost:8080/order/createOrder/${loggedInUser.userId}`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.status === 201) {
                    api.put(`/user/updateUserCart/${loggedInUser.userId}`, {
                        "cart": null
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
                    navigate(`/thankyou`);
                }else{
                    setPaymentError("Order Creation Failed. In case any amount is debited, It will be reverted back to source within 5-6 business days");
                }
            })
            .catch(error => setPaymentError("Order Creation Failed. In case any amount is debited, It will be reverted back to source within 5-6 business days"));
    }

    return (
        <>
            <Hero></Hero>

            <div className="untree_co-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <div className="border p-4 rounded" role="alert">
                                <p>Please Note that in case of customizations, any additional charges will be communicated to you. Upon completion of the payment, your order will be processed.</p>
                                <p>Shipment charges depends on our delevery partnes and distance to be covered. It has to be paid by the customer at the time of delivery.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-5 mb-md-0">
                            <h2 className="h3 mb-3 text-black">Billing Details</h2>
                            <div className="p-3 p-lg-5 border bg-white">

                                <div className="form-group row">
                                    <div className="col-md-6">
                                        <label htmlFor="fName" className="text-black">First Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="fName" name="fName" onChange={handleChange} value={billingData.fName} />
                                        {billingError.fName && <p className="error">{billingError.fName}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lName" className="text-black">Last Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="lName" name="lName" onChange={handleChange} value={billingData.lName} />
                                        {billingError.lName && <p className="error">{billingError.lName}</p>}
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <div className="col-md-12">
                                        <label htmlFor="add1" className="text-black">Address <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="add1" name="add1" placeholder="Apartment, suite, unit etc." onChange={handleChange} value={billingData.add1} />
                                        {billingError.add1 && <p className="error">{billingError.add1}</p>}
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <div className="col-md-12">
                                        <input type="text" className="form-control" id="add2" name="add2" placeholder="Street address" onChange={handleChange} value={billingData.add2} />
                                        {billingError.add2 && <p className="error">{billingError.add2}</p>}
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="landmark" className="text-black">Landmark </label>
                                    <input type="text" id="landmark" name="landmark" className="form-control" onChange={handleChange} value={billingData.landmark} />
                                    {billingError.landmark && <p className="error">{billingError.landmark}</p>}
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="country" className="text-black">Country <span className="text-danger">*</span></label>
                                    <input type="text" id="country" name="country" className="form-control" value={billingData.country} readOnly />
                                </div>

                                <div className="form-group row mt-3">
                                    <div className="col-md-6">
                                        <label htmlFor="state" className="text-black">State <span className="text-danger">*</span></label>
                                        <select id="state" name="state" className="form-control" onChange={handleChange} value={billingData.state} >
                                            <option value="">Select a state</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                            <option value="Assam">Assam</option>
                                            <option value="Bihar">Bihar</option>
                                            <option value="Chhattisgarh">Chhattisgarh</option>
                                            <option value="Goa">Goa</option>
                                            <option value="Gujarat">Gujarat</option>
                                            <option value="Haryana">Haryana</option>
                                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                                            <option value="Jharkhand">Jharkhand</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                                            <option value="Manipur">Manipur</option>
                                            <option value="Meghalaya">Meghalaya</option>
                                            <option value="Mizoram">Mizoram</option>
                                            <option value="Nagaland">Nagaland</option>
                                            <option value="Odisha">Odisha</option>
                                            <option value="Punjab">Punjab</option>
                                            <option value="Rajasthan">Rajasthan</option>
                                            <option value="Sikkim">Sikkim</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Tripura">Tripura</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                                            <option value="Uttarakhand">Uttarakhand</option>
                                            <option value="West Bengal">West Bengal</option>
                                            <option value="Andaman & Nicobar (UT)">Andaman & Nicobar (UT)</option>
                                            <option value="Chandigarh (UT)">Chandigarh (UT)</option>
                                            <option value="Dadra & Nagar Haveli and Daman & Diu (UT)">Dadra & Nagar Haveli and Daman & Diu (UT)</option>
                                            <option value="Delhi [National Capital Territory (NCT)]">Delhi [National Capital Territory (NCT)]</option>
                                            <option value="Jammu & Kashmir (UT)">Jammu & Kashmir (UT)</option>
                                            <option value="Ladakh (UT)">Ladakh (UT)</option>
                                            <option value="Lakshadweep (UT)">Lakshadweep (UT)</option>
                                            <option value="Puducherry (UT)">Puducherry (UT)</option>
                                        </select>
                                        {billingError.state && <p className="error">{billingError.state}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="postalCode" className="text-black">Zip Code <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="postalCode" name="postalCode" onChange={handleChange} value={billingData.postalCode} />
                                        {billingError.postalCode && <p className="error">{billingError.postalCode}</p>}
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="text-black">Email Address <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="email" name="email" onChange={handleChange} value={billingData.email} />
                                        {billingError.email && <p className="error">{billingError.email}</p>}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="text-black">Phone <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="phone" name="phone" placeholder="Phone Number" onChange={handleChange} value={billingData.phone} />
                                        {billingError.phone && <p className="error">{billingError.phone}</p>}
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="notes" className="text-black">Order Notes</label>
                                    <textarea name="notes" id="notes" cols="30" rows="8" className="form-control" placeholder="Write your notes here..." onChange={handleChange}>{billingData.notes}</textarea>
                                    {billingError.notes && <p className="error">{billingError.notes}</p>}
                                </div>

                            </div>
                        </div>
                        <div className="col-md-6">

                            <div className="row mb-5">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black">Coupon Code</h2>
                                    <div className="p-3 p-lg-5 border bg-white">

                                        <label htmlFor="c_code" className="text-black mb-3">Enter your coupon code if you have one</label>
                                        <div className="input-group w-75 couponcode-wrap">
                                            <input type="text" className="form-control me-2" id="c_code" placeholder="Coupon Code" aria-label="Coupon Code" aria-describedby="button-addon2" value={coupon} onChange={(event) => setCoupon(event.target.value)} />

                                            <div className="input-group-append">
                                                <button className="btn btn-black btn-sm" type="button" id="button-addon2" onClick={() => validateCoupon()}>Apply</button>
                                            </div>
                                        </div>
                                        <span>{couponError}</span>

                                    </div>
                                </div>
                            </div>

                            <div className="row mb-5">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black">Your Order</h2>
                                    <div className="p-3 p-lg-5 border bg-white">
                                        <table className="table site-block-order-table mb-5">
                                            <thead>
                                                <th>Product</th>
                                                <th>Total</th>
                                            </thead>
                                            <tbody>
                                                {orderDetails?.products?.map((product, index) => {

                                                    return (

                                                        <tr>
                                                            <td>{product.name} <strong className="mx-2">x</strong> {product.quantity}</td>
                                                            <td>&#8377; {product.total}</td>
                                                        </tr>
                                                    );
                                                })
                                                }
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
                                                    <td className="text-black">&#8377; {orderDetails.subTotal}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Discount</strong></td>
                                                    <td className="text-black">&#8377; {orderDetails.discount}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Order Total</strong></td>
                                                    <td className="text-black font-weight-bold"><strong>&#8377; {orderDetails.total}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="form-group">
                                            <button className="btn btn-black btn-lg py-3 btn-block" onClick={handleOrder}>Place Order</button>
                                            <p><span>{paymentError}</span></p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* </form> */}
                </div>
            </div>




        </>
    );
}

export default Checkout;
