import Hero from './Hero';
import { useState, useEffect } from "react";
import api from '../api/axiosConfig';

function Contact() {

    const [apiMessage, setApiMessage] = useState("");
    const [messageData, setMessageData] = useState({ fName: "", lName: "", email: "", message: "" });

    const [messageErrors, setMessageErrors] = useState({});


    const validateData = () => {
        let isValid = true;
        let newErrors = {};

        if (!messageData.fName.trim()) {
            newErrors.fName = 'First name is required';
            isValid = false;
        }

        if (!messageData.lName.trim()) {
            newErrors.lName = 'Last name is required';
            isValid = false;
        }

        if (!messageData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(messageData.email.trim())) {

            newErrors.email = 'Invalid email';
            isValid = false;
        }

        if (!messageData.message.trim()) {
            newErrors.message = 'Message is required';
            isValid = false;
        }
        setMessageErrors(newErrors);
        return isValid;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMessageData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleCreateMessage = (event) => {
        if (validateData()) {
            api.post('/message/createMessage', {
                firstName: messageData.fName,
                lastName: messageData.lName,
                email: messageData.email,
                message: messageData.message
            })
                .then(function (response) {
                    if (response.status === 201) {
                        setApiMessage(`Thank you for reaching out! Expect a response within 24 hours. Please use the ID: ${response.data.msgId} for further communications`);

                        setMessageData({ fName: "", lName: "", email: "", message: "" });
                        setMessageErrors({});
                    } else {
                        setApiMessage("Sorry your message was not registered due to some technical difficulties. Please try again in some time.");
                    }
                })
                .catch(function (error) {
                    setApiMessage("Sorry your message was not registered due to some technical difficulties. Please try again in some time.");
                });
        }

    };
    useEffect(() => {
        setApiMessage("");
    }, [])


    return (
        <>
            <Hero></Hero>
            {/* Start Contact Form */}
            <div className="untree_co-section">
                <div className="container">

                    <div className="block">
                        <div className="row justify-content-center">


                            <div className="col-md-8 col-lg-8 pb-4">


                                <div className="row mb-5">
                                    <div className="col-lg-4">
                                        <div className="service no-shadow align-items-center link horizontal d-flex active" data-aos="fade-left" data-aos-delay="0">
                                            <div className="service-icon color-1 mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                                </svg>
                                            </div>
                                            <div className="service-contents">
                                                <p>343/A Haridevpur, Kolkata 700104</p>
                                            </div> 
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="service no-shadow align-items-center link horizontal d-flex active" data-aos="fade-left" data-aos-delay="0">
                                            <div className="service-icon color-1 mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                                                </svg>
                                            </div>
                                            <div className="service-contents">
                                                <p>vinodsingh1508@gmail.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="service no-shadow align-items-center link horizontal d-flex active" data-aos="fade-left" data-aos-delay="0">
                                            <div className="service-icon color-1 mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                                </svg>
                                            </div>
                                            <div className="service-contents">
                                                <p>+91 980 455 8319</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-black" htmlFor="fName">First name</label>
                                            <input type="text" className="form-control" id="fName" name="fName" value={messageData.fName} onChange={handleChange} />
                                            {messageErrors.fName && <p className="error">{messageErrors.fName}</p>}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label className="text-black" htmlFor="lName">Last name</label>
                                            <input type="text" className="form-control" id="lName" name="lName" value={messageData.lName} onChange={handleChange} />
                                            {messageErrors.lName && <p className="error">{messageErrors.lName}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="text-black" htmlFor="email">Email address</label>
                                    <input type="email" className="form-control" id="email" name="email" value={messageData.email} onChange={handleChange} />
                                    {messageErrors.email && <p className="error">{messageErrors.email}</p>}
                                </div>

                                <div className="form-group mb-5">
                                    <label className="text-black" htmlFor="message">Message</label>
                                    <textarea className="form-control" id="message" name="message" onChange={handleChange} cols="30" rows="5">{messageData.message}</textarea>
                                    {messageErrors.message && <p className="error">{messageErrors.message}</p>}
                                </div>
                                {apiMessage}
                                <button type="button" className="btn btn-primary-hover-outline" onClick={handleCreateMessage}>Send Message</button>

                            </div>

                        </div>

                    </div>

                </div>


            </div>

            {/* End Contact Form */}




        </>
    );
}

export default Contact;
