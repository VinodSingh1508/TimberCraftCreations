import Hero from './Hero';
import Testimonials from "./Testimonials";
import './WhyChooseUs.css';

function WhyChooseUs() {

    return (
            <div className="why-choose-section">
                <div className="container">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-lg-6">
                            <h2 className="section-title">Why Choose Us</h2>
                            <p>Where exceptional craftsmanship meets personalized design, ensuring quality that lasts and satisfaction that matters.</p>

                            <div className="row my-5">
                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <img src="/images/craftsmanship.svg" alt="Image" className="imf-fluid why-choos-us-icon" />
                                        </div>
                                        <h3>Unmatched Craftsmanship</h3>
                                        <p>Each piece is handcrafted with precision and care, ensuring the highest quality and attention to detail.</p>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <img src="/images/customDesign.svg" alt="Image" className="imf-fluid why-choos-us-icon" />
                                        </div>
                                        <h3>Custom Design Excellencep</h3>
                                        <p>We bring your vision to life with personalized designs that perfectly fit your space and style.</p>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <img src="/images/durability.svg" alt="Image" className="imf-fluid why-choos-us-icon" />
                                        </div>
                                        <h3>Reliable Durability</h3>
                                        <p>Built to last, our furniture combines strength with elegance, offering beauty that stands the test of time.</p>
                                    </div>
                                </div>

                                <div className="col-6 col-md-6">
                                    <div className="feature">
                                        <div className="icon">
                                            <img src="/images/customerCentric.svg" alt="Image" className="imf-fluid why-choos-us-icon" />
                                        </div>
                                        <h3>Customer-Centric Approach</h3>
                                        <p>Your satisfaction is our priority. From design to delivery, we ensure a seamless and enjoyable experience.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="img-wrap">
                                <img src="/images/why-choose-us-img.jpg" alt="Image" className="img-fluid" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    );
}

export default WhyChooseUs;
