import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Cookies from 'js-cookie';
import api from '../api/axiosConfig';
import { Link } from "react-router-dom";
import OrderContainer from "./OrderContainer";

function LoginModal({ show, onHide, loggedInUser, setLoggedInUser }) {

  //https://react-bootstrap.netlify.app/docs/components/tabs/
  //https://react-bootstrap.netlify.app/docs/components/modal/
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", pass: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", pass: "" });
  const [profileData, setProfileData] = useState({ userId: "", name: "", email: "", phone: "", pass: "" });

  const [apiMessage, setApiMessage] = useState("");

  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [key, setKey] = useState('login');
  const [userOrders, setUserOrders] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      setKey("profile");
    } else {
      setKey("login");
    }
  }, [loggedInUser]);

  useEffect(() => {

    if (key === "profile") {
      setProfileData({ userId: loggedInUser.userId, name: loggedInUser.userName, email: loggedInUser.email, phone: loggedInUser.phone, pass: loggedInUser.password })
    } else {
      setProfileData({ userId: "", name: "", email: "", phone: "", pass: "" });
    }
    if (key === "orders") {
      getOrders(loggedInUser.userId);
    } else {
      setUserOrders(null);
    }
  }, [key, loggedInUser]);

  useEffect(() => {
    setApiMessage("");
  }, [key]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    if (key === "login") {
      setLoginData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
    else if (key === "register") {
      setRegisterData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
    else if (key === "profile") {
      setProfileData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const validateLogin = () => {
    let isValid = true;
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email.trim()) && !/^\d{10}$/.test(loginData.email.trim())) {

      newErrors.email = 'Invalid email / phone';
      isValid = false;
    }

    if (!loginData.pass.trim()) {
      newErrors.pass = 'Password is required';
      isValid = false;
    }
    setLoginErrors(newErrors);
    return isValid;
  };

  const validateRegisterUpdate = (from) => {
    let isValid = true;
    let newErrors = {};
    let data = {};
    if (from === "register")
      data = registerData;
    else if (from === "update")
      data = profileData;


    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {

      newErrors.email = 'Invalid email';
      isValid = false;
    }

    if (!data.phone.trim()) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(data.phone.trim())) {

      newErrors.phone = 'Invalid Phone';
      isValid = false;
    }

    if (!data.pass.trim()) {
      newErrors.pass = 'Password is required';
      isValid = false;
    }
    if (from === "register")
      setRegisterErrors(newErrors);
    else if (from === "update")
      setProfileErrors(newErrors)
    else
      return false;
    return isValid;
  };

  const handleSubmit = (event) => {
    if (key === "login")
      handleLogin(event);
    else if (key === "register")
      handleRegister(event);
    else if (key === "logout") {
      setLoggedInUser(null);
      Cookies.remove("user");
      navigate('/');
      onHide();
    } else if (key === "profile")
      handleUpdate(event);
    else
      console.log("Invalid Key");
  }

  const handleLogin = (event) => {
    if (validateLogin()) {
      api.post('/user/validateUser', {
        searchString: loginData.email,
        password: loginData.pass
      })
        .then(function (response) {
          if (response.status === 200) {
            let user = response.data;
            Cookies.set('user', JSON.stringify(user));
            setLoggedInUser(user);
            onHide();
          } else {
            setApiMessage("Login Failed");
            setLoggedInUser(null);
          }
        })
        .catch(function (error) {
          setApiMessage("Login Failed");
          setLoggedInUser(null);
        });
    }

  };

  const handleRegister = (event) => {
    if (validateRegisterUpdate("register")) {
      api.post('/user/createUser', {
        "userName": registerData.name,
        "email": registerData.email,
        "phone": registerData.phone,
        "password": registerData.pass,
        "admin": false,
        "userRatings": 5.0
      })
        .then(function (response) {
          if (response.status === 201) {
            let user = response.data;
            Cookies.set('user', JSON.stringify(user));
            setLoggedInUser(user);
            setApiMessage("User Registered Successfully");
          } else {
            setApiMessage("User Registration Failed");
            setLoggedInUser(null);
          }
        })
        .catch(function (error) {
          setApiMessage("User Registration Failed");
          setLoggedInUser(null);
        });
    }

  };

  const handleUpdate = (event) => {
    if (validateRegisterUpdate("update")) {
      api.put(`/user/updateUser/${profileData.userId}`, {
        "userName": profileData.name,
        "email": profileData.email,
        "phone": profileData.phone,
        "password": profileData.pass
      })
        .then(function (response) {
          if (response.status === 200) {
            let user = response.data;
            Cookies.set('user', JSON.stringify(user));
            setLoggedInUser(user);
            setApiMessage("User Updated Successfully");
          } else {
            setApiMessage("User Update Failed");
            setLoggedInUser(null);
          }
        })
        .catch(function (error) {
          setApiMessage("User Update Failed");
          setLoggedInUser(null);
        });

    }


  };

  const handleReset = () => {
    if (key === "login") {
      setLoginData({ email: "", pass: "" });
      setLoginErrors({});
      setApiMessage("");
    }
    else if (key === "register") {
      setRegisterData({ name: "", email: "", phone: "", pass: "" });
      setRegisterErrors({});
      setApiMessage("");
    }
    else if (key === "profile") {
      setProfileData({ userId: loggedInUser.userId, name: loggedInUser.userName, email: loggedInUser.email, phone: loggedInUser.phone, pass: loggedInUser.password })
      setProfileErrors({})
      setApiMessage("");
    }
  };

  const getOrders = async (userId) => {

    try {

      const response = await api.get(`/order/getOrderByUserId/${userId}`);

      setUserOrders(response.data);

    }
    catch (err) {
      console.log(err);
    }
  }

  const closeModalAndNavigate = (path) => {
    navigate(path);
    onHide();
  }


  return (
    <Modal
      show={show}
      onHide={() => {
        setApiMessage("");
        onHide();
      }
      }
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Welcome {loggedInUser ? loggedInUser.userName : "User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!loggedInUser &&
          <Tabs
            defaultActiveKey="login"
            id="justify-tab-example"
            className="mb-3"
            onSelect={(k) => setKey(k)}
            justify
          >
            <Tab eventKey="login" title="Login">

              <div className="mb-3">
                <label>Email address / Phone</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  id="email" name="email" value={loginData.email} onChange={handleChange}
                />
                {loginErrors.email && <p className="error">{loginErrors.email}</p>}
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  id="pass" name="pass" value={loginData.pass} onChange={handleChange}
                />
                {loginErrors.pass && <p className="error">{loginErrors.pass}</p>}
              </div>
            </Tab>
            <Tab eventKey="register" title="Register">
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  id="name" name="name" value={registerData.name} onChange={handleChange}
                />
                {registerErrors.name && <p className="error">{registerErrors.name}</p>}
              </div>
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  id="email" name="email" value={registerData.email} onChange={handleChange}
                />
                {registerErrors.email && <p className="error">{registerErrors.email}</p>}
              </div>
              <div className="mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone (10 digit)"
                  id="phone" name="phone" value={registerData.phone} onChange={handleChange}
                />
                {registerErrors.phone && <p className="error">{registerErrors.phone}</p>}
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  id="pass" name="pass" value={registerData.pass} onChange={handleChange}
                />
                {registerErrors.pass && <p className="error">{registerErrors.pass}</p>}
              </div>
            </Tab>
          </Tabs>
        }


        {loggedInUser &&
          <Tabs
            defaultActiveKey="profile"
            id="justify-tab-example"
            className="mb-3"
            onSelect={(k) => setKey(k)}
            justify
          >
            <Tab eventKey="profile" title="Profile">
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  id="name" name="name" value={profileData.name} onChange={handleChange}
                />
                {profileErrors.name && <p className="error">{profileErrors.name}</p>}
              </div>
              <div className="mb-3">
                <label>Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  id="email" name="email" value={profileData.email} onChange={handleChange}
                />
                {profileErrors.email && <p className="error">{profileErrors.email}</p>}
              </div>
              <div className="mb-3">
                <label>Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phone (10 digit)"
                  id="phone" name="phone" value={profileData.phone} onChange={handleChange}
                />
                {profileErrors.phone && <p className="error">{profileErrors.phone}</p>}
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  id="pass" name="pass" value={profileData.pass} onChange={handleChange}
                />
                {profileErrors.pass && <p className="error">{profileErrors.pass}</p>}
              </div>
            </Tab>

            {/* <Tab eventKey="logout" title="Log Out" disabled> */}
            <Tab eventKey="logout" title="Log Out">
              Are you sure to logout?
            </Tab>
            <Tab eventKey="orders" title="Your Orders">
              {userOrders && userOrders?.map((ord, index) => (
                <OrderContainer order={ord}></OrderContainer>
              ))}
              {!userOrders &&
                <div className="row justify-content-center mb-3">
                  <p>
                    You have not ordered anything yet. Checkout our products <span onClick={() => closeModalAndNavigate('/shop')} style={{ cursor: 'pointer', fontWeight: "bold", textDecoration: 'underline' }}> here</span>.
                  </p>
                </div>
              }
            </Tab>

          </Tabs>
        }




      </Modal.Body>
      <Modal.Footer>
        {apiMessage && <span className='formError error'>{apiMessage}</span>}
        {loggedInUser && key === "orders" &&
          <div className="row justify-content-center">
            <p>In case of any modifications required, please write us &nbsp;
              <span onClick={() => closeModalAndNavigate('/contact')} style={{ cursor: 'pointer', fontWeight: "bold", textDecoration: 'underline' }}>
                here
              </span>. Please don't forget to mention the Order ID.
            </p>
            <p>All changes requested are subject to approval.</p>
          </div>
        }
        {loggedInUser && key === "logout" &&
          <Button type="button" onClick={handleSubmit}>Logout</Button>
        }
        {loggedInUser && key === "profile" &&
          <>
            <Button type="button" onClick={handleSubmit}>Update</Button>
            <Button type="button" onClick={handleReset}>Reset</Button>
          </>
        }
        {!loggedInUser && (key === "login" || key === "register") &&
          <>
            <Button type='button' onClick={handleSubmit}>Submit</Button>
            <Button type="button" onClick={handleReset}>Reset</Button>
          </>
        }
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;

