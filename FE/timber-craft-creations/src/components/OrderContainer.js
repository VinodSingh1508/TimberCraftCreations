import { useState, useEffect } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import api from '../api/axiosConfig';

function OrderContainer({ order, getAllOrderByStatus, allOrderStatus = [], isAdmin = false }) {
    const [open, setOpen] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const formatDate = (date) => {
        date = new Date(date);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    const handleStatusUpdate = async (orderId) => {
        console.log(`Updating status for Order ID: ${orderId}`, newStatus);
        try {
            let status=newStatus;
            console.log(status);
            const response = await api.put(`/order/updateOrder/${orderId}?status=${newStatus}`);
            if(response.status===200)
                getAllOrderByStatus();
          } catch (error) {
            console.error('Error updating order:', error);
          }
    };

    useEffect(() => {
        setNewStatus(order?.status)
    }, []);

    return (
        <>
            <div
                onClick={() => setOpen(!open)}
                aria-controls={`collapse-container-${order?.id}`}
                aria-expanded={open}
                style={{
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    color: 'black',
                    border: '1px solid #ccc',
                    width: '100%',
                    marginBottom: '10px'
                }}
            >
                <strong>Order ID:</strong> {order?.id} <strong>Amount:</strong> {order?.total} <strong>Status:</strong> {order?.status} {order?.shippingDate ? ` Shipped On ${formatDate(order?.shippingDate)}` : ''}
            </div>
            <Collapse in={open}>
                <div id={`collapse-container-${order?.id}`} className="border rounded border-2 border-dark mb-2">
                    {isAdmin && (
                        <div className=" border-bottom border-2 border-dark" style={{ display: 'flex', gap: '10px' }}>
                            <div className="ps-2" style={{ flex: 1 }}>
                                <p><strong>User Name: </strong>{order?.user?.userName} <strong>Phone: </strong>{order?.user?.phone} <strong>Email: </strong>{order?.user?.email}</p>
                                <p>
                                    <strong>Order Date: </strong>{formatDate(order?.orderDate)}
                                    <strong>Amount: </strong>{order?.discount > 0 ? `${order?.subTotal} - ${order?.discount}( ${order?.coupon})=${order?.total}` : `${order?.total}`}
                                </p>
                                <p><strong>Notes: </strong>{order?.orderAddress?.notes} </p>
                                <p><strong>Address: </strong>
                                    {order?.orderAddress?.firstName} {order?.orderAddress?.lastName}<br />
                                    {order?.orderAddress?.addressLine1} {order?.orderAddress?.addressLine2}<br />
                                    {order?.orderAddress?.landmark ? `Near ${order?.orderAddress?.landmark}` : ''}<br />
                                    {order?.orderAddress?.state} {order?.orderAddress?.country} {order?.orderAddress?.postalCode}<br />
                                    Phone: {order?.orderAddress?.phone}<br />
                                    Email: {order?.orderAddress?.email}
                                </p>
                            </div>
                            <div className="form-group ps-2 border-start border-2 border-dark" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
                                <label className="text-black" htmlFor="status" style={{ whiteSpace: 'nowrap' }}>Update Status</label>
                                <select
                                    id="state"
                                    name="state"
                                    className="form-control"
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    value={newStatus}  // Set the selected option here
                                >
                                    {allOrderStatus && allOrderStatus.length > 0 && (
                                        allOrderStatus.map((s) => {
                                            return (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            );
                                        })
                                    )}
                                </select>
                                <button className="btn btn-primary" onClick={() => handleStatusUpdate(order?.id)} style={{ whiteSpace: 'nowrap' }}>Update Status</button>
                            </div>
                        </div>
                    )}
                    <div className="site-blocks-table">
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th className="product-thumbnail" colSpan={2}>Product</th>
                                    <th className="product-price">Price</th>
                                    <th className="product-quantity">Quantity</th>
                                    <th className="product-customizations">Customizations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.orderItems?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="product-thumbnail">
                                            <img src={`http://localhost:8080/${item.product.displayImage}`} alt="Image" className="img-fluid" />
                                        </td>
                                        <td className="product-name">
                                            <h2 className="h5 text-black">{item.product.name}</h2>
                                        </td>
                                        <td className="text-black">&#8377; {item.product.price}</td>
                                        <td className="text-black">
                                            {item.quantity}
                                        </td>
                                        <td className="text-black">
                                            {item.customization}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Collapse>
        </>
    );
}

export default OrderContainer;
