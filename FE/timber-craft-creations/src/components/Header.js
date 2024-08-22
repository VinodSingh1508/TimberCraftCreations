import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import LoginModal from './LoginModal.js';

import './Header.css';

function Header({ loggedInUser, setLoggedInUser }) {

  const [modalShow, setModalShow] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const handleLogin = () => {
    setModalShow(true);
  };

  useEffect(() => {
    setCartCount((loggedInUser && loggedInUser.cart) ? JSON.parse(loggedInUser.cart).length : 0);

  }, [loggedInUser]);



  return (
    <>
      <nav className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark" arial-label="Furni navigation bar">

        <div className="container">
          <NavLink className="navbar-brand" to="/">Timber-Craft Creations<span>.</span></NavLink>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsFurni" aria-controls="navbarsFurni" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsFurni">
            <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
              <li className='nav-item'>
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className="nav-link" to="/shop">Shop</NavLink>
              </li>
              {/* <li className='nav-item'>
                <NavLink className="nav-link" to="/services">Services</NavLink>
              </li> */}
              <li className='nav-item'>
                <NavLink className="nav-link" to="/contact">Contact us</NavLink>
              </li>
              {loggedInUser && loggedInUser.admin &&
              <li className='nav-item'>
                <NavLink className="nav-link" to="/admin">Admin</NavLink>
              </li>
}
            </ul>

            <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
              {loggedInUser &&
                <li>
                  <NavLink className={`nav-link ${cartCount <= 0 ? 'disabled' : ''}`} to="/cart" onClick={(e) => {
                    if (cartCount <= 0) {
                      e.preventDefault();
                    }
                  }}>
                    <img src="/images/cart.svg" alt="Cart" />
                    {cartCount > 0 && (
                      <span className="cart-item-count">{cartCount}</span>
                    )}
                  </NavLink>
                </li>
              }
              <li><NavLink className="nav-link" to="/"><img src="/images/user.svg" alt="User" onClick={(e) => {
                e.preventDefault();
                handleLogin();
              }} /></NavLink></li>


              {/* <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-basic">
                  <img src="/images/user.svg" alt="User" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/login">Login</Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/register">Register</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => handleLogin()}>Test</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}
            </ul>


          </div>
        </div>

      </nav>

      <LoginModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
    </>
  );
}

export default Header;
