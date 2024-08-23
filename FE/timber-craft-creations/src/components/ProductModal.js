
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Carousel from 'react-bootstrap/Carousel';

function ProductModal({ show, onHide, product, handleAddToCart, loggedInUser }) {
  // https://react-bootstrap.netlify.app/docs/components/carousel/

  const [key, setKey] = useState('details');

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {product?.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          defaultActiveKey={key}
          id="justify-tab-example"
          className="mb-3"
          onSelect={(k) => setKey(k)}
          justify
        >
          <Tab eventKey="details" title="Product Details">
            {product?.description}
          </Tab>
          <Tab eventKey="info" title="Product Info">
            <p>Category: {product?.category}</p>
            <p>Sub Category: {product?.subCategory}</p>
            <p>Price: &#8377; {product?.price}</p>
          </Tab>
          <Tab eventKey="images" title="Product Images">

            <Carousel fade>
              {product?.imageUrls?.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={`http://localhost:8080/${image}`}
                    alt={`Product Image ${index + 1}`}
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Tab>
        </Tabs>
      </Modal.Body>

      {loggedInUser && (
        <Modal.Footer>
          <Button type='button' onClick={() => handleAddToCart(product)}>
            {!loggedInUser.cart || JSON.parse(loggedInUser.cart).length === 0 ||
              !JSON.parse(loggedInUser.cart).some(item => item?.productId === product?.productId)
              ? "Add To Cart"
              : "Remove From Cart"}
          </Button>
        </Modal.Footer>
      )}

      {!loggedInUser &&
        <Modal.Footer style={{
          display: "flex",
          justifyContent: "center",
        }}>
          <span style={{ "text-align": "center", "color": 'red' }}>Please Login to add item to cart.</span>
        </Modal.Footer>}

    </Modal>
  );
}

export default ProductModal;
