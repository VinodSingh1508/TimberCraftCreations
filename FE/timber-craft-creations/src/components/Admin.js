import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import axios from 'axios';
import api from '../api/axiosConfig';
import OrderContainer from './OrderContainer';
import MessageContainer from './MessageContainer';

function Admin({ products }) {
    const [key, setKey] = useState('product');

    const [selectedProduct, setSelectedProduct] = useState([]);
    const [productData, setProductData] = useState({ description: "", category: "", subCategory: "", images: [], thumbnail: null, price: 0.00 });
    const [productError, setProductError] = useState({});
    const [productUploadStatus, setProductUploadStatus] = useState('');

    const [coupons, setCoupons] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState([]);
    const [couponData, setCouponData] = useState({ validFrom: "", validTill: "", flatPercent: "Flat", amount: 0.00, minCartValue: 0.00, forUsers: "" });
    const [couponError, setCouponError] = useState({});
    const [couponUploadStatus, setCouponUploadStatus] = useState('');

    const [filterStatus, setFilterStatus] = useState("");
    const [allOrderStatus, setAllOrderStatus] = useState([]);
    const [orderList, setOrderList] = useState([]);

    const [subscribersCount, setSubscribersCount] = useState(0);
    const [pubNewsStatus, setPubNewsStatus] = useState('');
    const [newsData, setNewsData] = useState({ subject: "", body: "" });
    const [newsError, setNewsError] = useState({});

    const [unreadMessages, setUnreadMessages] = useState();


    const formatDate = (date) => {
        date = new Date(date);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    const fetchUniqueStatuses = async () => {
        try {
            const response = await api.get('/order/getAllStatuses');
            const data = await response.data;
            setAllOrderStatus(data);
        } catch (error) {
            setAllOrderStatus([]);
            console.error('Error fetching statuses:', error);
        }
    };

    const getAllOrderByStatus = async () => {
        setOrderList([]);
        try {
            const response = await api.get(`/order/searchOrderByStatus`, {
                params: { status: filterStatus }
            });
            setOrderList(response.data);
        } catch (err) {
            setOrderList([]);
            console.error('Error fetching orders:', err);
        }
    }

    const getAllCoupons = async () => {
        try {
            const response = await api.get('/coupons');
            const data = await response.data;

            const formattedData = data.map(coupon => ({
                ...coupon,
                validFrom: formatDate(coupon.validFrom),
                validTill: formatDate(coupon.validTill)
            }));

            setCoupons(formattedData);
        } catch (error) {
            setCoupons([]);
            console.error('Error fetching Coupons:', error);
        }
    };

    const getAllUnreadMessages = async () => {
        setUnreadMessages([]);
        try {
            const response = await api.get(`/message/gatAllUnread`);
            if (response.status === 200)
                setUnreadMessages(response.data);
        } catch (err) {
            setUnreadMessages([]);
            console.error('Error fetching unread messages:', err);
        }
    }

    const getSubscribersCount = async () => {
        try {
            const response = await api.get('/subscriptions/getCount');
            const data = await response.data;
            setSubscribersCount(data);
        } catch (error) {
            setSubscribersCount(0)
            console.error('Error Fetching Subscribers Count:', error);
        }
    };

    const handlePublishNews = async () => {
        setNewsError({});
        let isValid = true;
        if (!newsData.subject || newsData.subject.length <= 0) {
            setNewsError((prevData) => ({ ...prevData, "subject": "Subject is required" }));
            isValid = false;
        }
        if (!newsData.body || newsData.body.length <= 0) {
            setNewsError((prevData) => ({ ...prevData, "body": "Email body is required" }));
            isValid = false;
        }
        if (isValid) {
            try {
                const response = await api.post('http://localhost:8080/send-email', newsData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.data;
                setPubNewsStatus(data);
            } catch (error) {
                setPubNewsStatus("Sending email failed");
                console.error('Error Fetching Subscribers Count:', error);
            }
        }

    }

    const handleCouponChange = (event) => {
        const { name, value } = event.target;
        setCouponData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleNewsLetterChange = (event) => {
        const { name, value } = event.target;
        setNewsData((prevData) => ({ ...prevData, [name]: value }));
    }

    function isValidDate(dateString) {
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!datePattern.test(dateString)) {
            return false;
        }

        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    }

    const handleAddUpdateCoupon = async () => {
        let isValid = true;

        setCouponError({});
        if (!selectedCoupon || selectedCoupon.length <= 0) {
            setCouponError((prevData) => ({ ...prevData, "coupon": "Coupon is required" }));
            isValid = false;
        }

        if (!isValidDate(couponData.validFrom)) {
            setCouponError((prevData) => ({ ...prevData, "validFrom": "Invalid date format. Use dd/mm/yyyy." }));
            isValid = false;
        }
        if (!isValidDate(couponData.validTill)) {
            setCouponError((prevData) => ({ ...prevData, "validTill": "Invalid date format. Use dd/mm/yyyy." }));
            isValid = false;
        }

        const validFromDate = new Date(couponData.validFrom.split('/').reverse().join('-'));
        const validTillDate = new Date(couponData.validTill.split('/').reverse().join('-'));

        if (validTillDate <= validFromDate) {
            setCouponError((prevData) => ({ ...prevData, "validTill": "Valid Till should be after Valid From." }));
            isValid = false;
        }

        if (couponData.amount <= 0) {
            setCouponError((prevData) => ({ ...prevData, "amount": "Amount should not be less than 0." }));
            isValid = false;
        } else if (couponData.flatPercent === 'Percent' && couponData.amount >= 100) {
            setCouponError((prevData) => ({ ...prevData, "amount": "Amount should not be less than 100%." }));
            isValid = false;
        }

        if (couponData.minCartValue <= 0) {
            setCouponError((prevData) => ({ ...prevData, "minCartValue": "Minimum cart value should be greater than 0." }));
            isValid = false;
        }

        if (couponData.forUsers !== '*' && !/^[^*]+$/.test(couponData.forUsers)) {
            setCouponError((prevData) => ({ ...prevData, "forUsers": "Users should either be '*' or comma separated phone or email" }));
            isValid = false;
        }

        if (isValid) {
            setCouponError({});
            const couponDTO = {
                couponId: selectedCoupon[0].name,
                validFrom: couponData.validFrom,
                validTill: couponData.validTill,
                flatPercent: couponData.flatPercent,
                amount: couponData.amount,
                minCartValue: couponData.minCartValue,
                forUsers: couponData.forUsers
            };
            try {
                const response = await api.put('http://localhost:8080/coupons/updateCoupon', couponDTO, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    setCoupons([]);
                    getAllCoupons();
                    setCouponUploadStatus('Coupon uploaded successfully');
                    setCouponData({ validFrom: "", validTill: "", flatPercent: "Flat", amount: 0.00, minCartValue: 0.00, forUsers: "" });
                    setSelectedCoupon([]);
                } else {
                    setCouponUploadStatus('Product uploaded failed');
                }
            } catch (error) {
                setCouponUploadStatus('Product uploaded failed');
            }
        }
    }

    const handleProductChange = (event) => {
        const { name, files, value } = event.target;
        if (name === 'images') {
            setProductData((prevData) => ({ ...prevData, "images": files ? files : [] }));
        } else if (name === 'thumbnail') {
            setProductData((prevData) => ({ ...prevData, "thumbnail": files ? files[0] : null }));
        } else if (name === 'price') {
            if (value)
                setProductData((prevData) => ({ ...prevData, [name]: parseFloat(value) }));
            else
                setProductData((prevData) => ({ ...prevData, [name]: 0.00 }));
        } else {
            setProductData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleAddUpdateProduct = async () => {
        setProductError({});
        let isValid = true;
        if (!selectedProduct || selectedProduct.length <= 0) {
            setProductError((prevData) => ({ ...prevData, "product": "Product is required" }));
            isValid = false;
        }
        if (!productData.images || productData.images.length <= 0) {
            setProductError((prevData) => ({ ...prevData, "images": "Product image is required" }));
            isValid = false;
        }
        if (!productData.thumbnail) {
            setProductError((prevData) => ({ ...prevData, "thumbnail": "Product thumbnail is required" }));
            isValid = false;
        }
        if (!productData.price || parseFloat(productData.price) <= 0) {
            setProductError((prevData) => ({ ...prevData, "price": "Invalid Price" }));
            isValid = false;
        }
        if (!productData.subCategory || productData.subCategory.length <= 0) {
            setProductError((prevData) => ({ ...prevData, "subCategory": "Subcategory is required" }));
            isValid = false;
        }
        if (!productData.category || productData.category.length <= 0) {
            setProductError((prevData) => ({ ...prevData, "category": "Category is required" }));
            isValid = false;
        }
        if (!productData.description || productData.description.length <= 0) {
            setProductError((prevData) => ({ ...prevData, "description": "Description is required" }));
            isValid = false;
        }
        if (isValid) {
            setProductError({});
            const existingProduct = products.some(pr => pr.name.includes(selectedProduct[0].name))

            const imagesBase64 = await Promise.all(Array.from(productData.images).map(convertFileToBase64));
            const thumbnailBase64 = await convertFileToBase64(productData.thumbnail);
            //action:"", product:""
            const productDTO = {
                images: imagesBase64,
                thumbnail: thumbnailBase64,
                price: productData.price,
                subCategory: productData.subCategory,
                category: productData.category,
                description: productData.description,
                action: existingProduct ? "UPDATE" : "INSERT",
                product: selectedProduct[0].name
            };
            try {
                const response = await api.post('http://localhost:8080/product/upload', productDTO, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    setProductUploadStatus('Product uploaded successfully');
                    setProductData({ description: "", category: "", subCategory: "", images: [], thumbnail: null, price: 0.00 });
                    setSelectedProduct([]);
                } else {
                    setProductUploadStatus('Product uploaded failed');
                }
            } catch (error) {
                setProductUploadStatus('Product uploaded failed');
            }
        }
    };

    useEffect(() => {
        getAllCoupons();
        fetchUniqueStatuses();
        getSubscribersCount();
        getAllUnreadMessages();
    }, []);

    useEffect(() => {
        setOrderList([]);
        getAllOrderByStatus();
    }, [filterStatus]);

    useEffect(() => {
        if (selectedProduct && selectedProduct.length > 0) {
            const result = products.find(obj => obj.name === selectedProduct[0].name);
            setProductError({});
            if (result)
                setProductData({ description: result.description, category: result.category, subCategory: result.subCategory, images: [], thumbnail: null, price: result.price });
            else
                setProductData({ description: "", category: "", subCategory: "", images: [], thumbnail: null, price: 0.00 });
        }
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedCoupon && selectedCoupon.length > 0) {
            setCouponError({});
            const result = coupons.find(obj => obj.couponId === selectedCoupon[0].name);
            if (result)
                setCouponData({ validFrom: result.validFrom, validTill: result.validTill, flatPercent: result.flatPercent, amount: result.amount, minCartValue: result.minCartValue, forUsers: result.forUsers });
            else
                setCouponData({ validFrom: "", validTill: "", flatPercent: "Flat", amount: 0.00, minCartValue: 0.00, forUsers: "" });
        }
    }, [selectedCoupon]);

    useEffect(() => {
        console.log({ couponData });
    }, [couponData]);

    return (
        <>
            <Hero />

            <div className="untree_co-section before-footer-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-12">
                            <Tabs
                                defaultActiveKey={key}
                                id="justify-tab-example"
                                className="mb-3"
                                onSelect={(k) => setKey(k)}
                            >
                                <Tab eventKey="product" title="Add / Update Product">
                                    <div className="mb-3">
                                        <label htmlFor="product" className="text-black">Product Name <span className="text-danger">*</span></label>
                                        <Typeahead
                                            id="product"
                                            name="product"
                                            labelKey="name"
                                            options={products?.map(pr => pr.name)}
                                            placeholder="Choose a product or enter a new one..."
                                            allowNew
                                            onChange={(selectedItems) => {
                                                setSelectedProduct(selectedItems);
                                            }}
                                            selected={selectedProduct}
                                            onBlur={(e) => {
                                                const inputValue = e.target.value;
                                                setSelectedProduct([{ name: inputValue }]);
                                            }}
                                        />
                                        {productError.product && <p className="error">{productError.product}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="text-black">Description <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Enter description"
                                            rows="4"
                                            id="description" name="description" value={productData.description} onChange={handleProductChange}
                                        />
                                        {productError.description && <p className="error">{productError.description}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="text-black">Category <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter category"
                                            id="category" name="category" value={productData.category} onChange={handleProductChange}
                                        />
                                        {productError.category && <p className="error">{productError.category}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="subCategory" className="text-black">Sub-Category <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter sub-category"
                                            id="subCategory" name="subCategory" value={productData.subCategory} onChange={handleProductChange}
                                        />
                                        {productError.subCategory && <p className="error">{productError.subCategory}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="images" className="text-black">Images <span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="images"
                                            id="images"
                                            multiple
                                            accept="image/*"
                                            onChange={handleProductChange}
                                        />
                                        {productError.images && <p className="error">{productError.images}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="thumbnail" className="text-black">Thumbnail <span className="text-danger">*</span></label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="thumbnail"
                                            id="thumbnail"
                                            accept="image/*"
                                            onChange={handleProductChange}
                                        />
                                        {productError.thumbnail && <p className="error">{productError.thumbnail}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="text-black">Price <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter price"
                                            step="0.01"
                                            min="0"
                                            id="price" name="price" value={productData.price} onChange={handleProductChange}
                                        />
                                        {productError.price && <p className="error">{productError.price}</p>}
                                    </div>
                                    <button type="button" className="btn btn-primary" onClick={handleAddUpdateProduct}>Submit</button>
                                    {productUploadStatus && <p>{productUploadStatus}</p>}
                                </Tab>

                                <Tab eventKey="orders" title="Orders">
                                    <div className="row justify-content-center">
                                        <div className="col-auto d-flex align-items-center">
                                            <label htmlFor="state" className="col-form-label text-black mb-0 me-2" style={{ whiteSpace: 'nowrap' }}>
                                                Filter By Status
                                            </label>
                                            <select id="state" name="state" className="form-control" onChange={(e) => setFilterStatus(e.target.value)}>
                                                <option value="">All</option>
                                                {allOrderStatus && allOrderStatus.length > 0 && (
                                                    allOrderStatus.map((s) => {
                                                        return (
                                                            <option key={s} value={s}>{s}</option>
                                                        );
                                                    })
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <hr />


                                    {orderList && orderList.length > 0 ? (
                                        orderList?.map((ord) => {
                                            return (
                                                <OrderContainer key={ord.id} order={ord} getAllOrderByStatus={getAllOrderByStatus} allOrderStatus={allOrderStatus} isAdmin={true}></OrderContainer>
                                            )
                                        })
                                    ) : (
                                        <div className="row justify-content-center">
                                            <div className="col-auto d-flex align-items-center">
                                                Order List Is Empty
                                            </div>
                                        </div>
                                    )
                                    }
                                </Tab>

                                <Tab eventKey="coupons" title="Coupons">
                                    <div className="mb-3">
                                        <label htmlFor="coupon" className="text-black">Coupon <span className="text-danger">*</span></label>
                                        <Typeahead
                                            id="coupon"
                                            name="coupon"
                                            labelKey="name"
                                            options={coupons?.map(cou => cou.couponId)}
                                            placeholder="Choose a coupon or enter a new one..."
                                            allowNew
                                            onChange={(selectedItems) => {
                                                setSelectedCoupon(selectedItems);
                                            }}
                                            selected={selectedCoupon}
                                            onBlur={(e) => {
                                                const inputValue = e.target.value;
                                                setSelectedCoupon([{ name: inputValue }]);
                                                console.log(inputValue);
                                            }}
                                        />
                                        {couponError.coupon && <p className="error">{couponError.coupon}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="validFrom" className="text-black">Valid From <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Date in dd/mm/yyy format"
                                            id="validFrom" name="validFrom" value={couponData.validFrom} onChange={handleCouponChange}
                                        />
                                        {couponError.validFrom && <p className="error">{couponError.validFrom}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="validTill" className="text-black">Valid Till <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Date in dd/mm/yyy format"
                                            id="validTill" name="validTill" value={couponData.validTill} onChange={handleCouponChange}
                                        />
                                        {couponError.validTill && <p className="error">{couponError.validTill}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="flatPercent" className="text-black">Flat / Percent <span className="text-danger">*</span></label>
                                        <select id="flatPercent" name="flatPercent" className="form-control" value={couponData.flatPercent} onChange={handleCouponChange}>
                                            <option key="Flat" value="Flat">Flat</option>
                                            <option key="Percent" value="Percent">Percent</option>
                                        </select>
                                        {couponError.flatPercent && <p className="error">{couponError.flatPercent}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="amount" className="text-black">Amount <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter amount"
                                            step="0.01"
                                            min="0"
                                            id="amount" name="amount" value={couponData.amount} onChange={handleCouponChange}
                                        />
                                        {couponError.amount && <p className="error">{couponError.amount}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="minCartValue" className="text-black">Minimum Cart Value <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter minimum cart value"
                                            step="0.01"
                                            min="0"
                                            id="minCartValue" name="minCartValue" value={couponData.minCartValue} onChange={handleCouponChange}
                                        />
                                        {couponError.minCartValue && <p className="error">{couponError.minCartValue}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="forUsers" className="text-black">Users <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Comma separated phone or email. * for all users."
                                            id="forUsers" name="forUsers" value={couponData.forUsers} onChange={handleCouponChange}
                                        />
                                        {couponError.forUsers && <p className="error">{couponError.forUsers}</p>}
                                    </div>

                                    <button type="button" className="btn btn-primary" onClick={handleAddUpdateCoupon}>Submit</button>
                                    {couponUploadStatus && <p>{couponUploadStatus}</p>}
                                </Tab>

                                <Tab eventKey="news" title="Publish News">
                                    <div className="row justify-content-center text-black">
                                        <div className="col-auto d-flex align-items-center">
                                            <span><strong>Note:</strong>You have <strong>{subscribersCount}</strong> people subscribed to newsletters. An email will be sent to all of them.</span>
                                        </div>
                                    </div>
                                    <hr />

                                    <div className="mb-3">
                                        <label htmlFor="subject" className="text-black">Subject <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter subject line"
                                            id="subject" name="subject" value={newsData.subject} onChange={handleNewsLetterChange}
                                        />
                                        {newsError.subject && <p className="error">{newsError.subject}</p>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="text-black">Body <span className="text-danger">*</span></label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Email body"
                                            rows="4"
                                            id="body" name="body" value={newsData.body} onChange={handleNewsLetterChange}
                                        />
                                        {newsError.body && <p className="error">{newsError.body}</p>}
                                    </div>

                                    <button type="button" className="btn btn-primary" onClick={handlePublishNews}>Publish</button>
                                    {pubNewsStatus && <p>{pubNewsStatus}</p>}
                                </Tab>

                                <Tab eventKey="contact" title="User Messages">
                                    {unreadMessages && unreadMessages.length > 0 ? (
                                        unreadMessages?.map((urm) => {
                                            return (
                                                <MessageContainer key={urm.msgId} message={urm} getAllUnreadMessages={getAllUnreadMessages}></MessageContainer>
                                            )
                                        })
                                    ) : (
                                        <div className="row justify-content-center">
                                            <div className="col-auto d-flex align-items-center">
                                                No new messages found
                                            </div>
                                        </div>
                                    )
                                    }
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin;
