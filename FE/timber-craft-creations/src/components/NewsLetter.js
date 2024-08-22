import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const SubscriptionForm = ({loggedInUser}) => {
    const [data, setData] = useState(loggedInUser?{name:loggedInUser.userName, email: loggedInUser.email, isValid:true}:{name:'', email:'', isValid:false});
    const [message, setMessage] = useState('');
    useEffect(() => {
        setData(loggedInUser?{name:loggedInUser.userName, email: loggedInUser.email, isValid:true}:{name:'', email:'', isValid:false})
    }, [loggedInUser])
    
    const validate = () => {
      let isValid = true;
    
      if (!data.name) {
        isValid = false;
      } else if (!data.email) {
        isValid = false;
      } 
      if(isValid){
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(data.email)) {
          setMessage("Please enter a valid email address.");
          isValid = false;
        }
      }
      if(isValid)
        setMessage("");
      setData((prevData) => ({ ...prevData, isValid }));
    };
    
    
  const handleSubmit = (e) => {
    e.preventDefault();
        api.post('/subscriptions', {
          "name": data.name,
          "email": data.email
        })
          .then(function (response) {
                setMessage(response.data);
          })
          .catch(function (error) {
            setMessage("Error occured while subscribing");
          });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
      setData((prevData) => ({ ...prevData, [name]: value }));
      validate();
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="subscription-form">
          <h3 className="d-flex align-items-center">
            <span className="me-1">
              <img src="/images/envelope-outline.svg" alt="Image" className="img-fluid" />
            </span>
            <span>Subscribe to Newsletter</span>
          </h3>

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-auto">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your name"
                value={data.name}
                onChange={(event)=>handleChange(event)}
              />
            </div>
            <div className="col-auto">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={data.email}
                onChange={(event)=>handleChange(event)}
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!data.isValid} // Disable button if name or email is empty
              >
                <span className="fa fa-paper-plane"></span>
              </button>
            </div>
          </form>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
