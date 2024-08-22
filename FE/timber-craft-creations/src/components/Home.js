import Testimonials from "./Testimonials";
import Hero from "./Hero";
import WhyChooseUs from "./WhyChooseUs";

import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import OurTeam from "./OurTeam";


function Home() {
  const [top3Products, setTop3Products] = useState([]);
  const getTop3Products = async () => {

    try {

      const response = await api.get("/product/getTop3Products");

      setTop3Products(response.data);

    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getTop3Products();
  }, [])

  return (
    <>

      <Hero></Hero>

      <div className="product-section">
        <div className="container">
          <div className="row">

            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">Crafted with excellent material.</h2>
              <p className="mb-4">Every piece we create is crafted with top-quality materials, ensuring durability and a premium finish. Our commitment to excellence guarantees furniture that not only looks stunning but also stands the test of time. </p>
              <p><a href="/shop" className="btn">Explore</a></p>
            </div>
            {top3Products && top3Products.length > 0 ? (
              top3Products?.map((p) => {
                return (
                  <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                    <a className="product-item" href="/shop">
                      <img src={`http://localhost:8080/${p.displayImage}`} className="img-fluid product-thumbnail" />
                      <h3 className="product-title">{p.name}</h3>
                      <strong className="product-price">&#8377; {p.price}</strong>
                      {/* 
                <span className="icon-cross">
                  <img src="/images/cross.svg" className="img-fluid" />
                </span> */}
                    </a>
                  </div>

                )
              })
            ) : (
              <div>
                Loading products...
              </div>
            )
            }

          </div>
        </div>
      </div>

      <WhyChooseUs></WhyChooseUs>

      <div className="we-help-section">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-7 mb-5 mb-lg-0">
              <div className="imgs-grid">
                <div className="grid grid-1"><img src="/images/img-grid-1.jpg" alt="Untree.co" /></div>
                <div className="grid grid-2"><img src="/images/img-grid-2.jpg" alt="Untree.co" /></div>
                <div className="grid grid-3"><img src="/images/img-grid-3.jpg" alt="Untree.co" /></div>
              </div>
            </div>
            <div className="col-lg-5 ps-lg-5">
              <h2 className="section-title mb-4">We Help You Make Modern Interior Design</h2>
              <p>At TimberCraft Creations, we specialize in bringing modern interior design to life, creating spaces that reflect your unique style and personality. Whether it’s custom-made furniture or personalized design solutions, we help you craft interiors that are not only functional but also elegant and timeless.</p>

              <ul className="list-unstyled custom-list my-4">
                <li><strong>Custom Furniture Solutions</strong> Tailor-made pieces that perfectly fit your space and style.</li>
                <li><strong>Innovative Design Ideas</strong> Creative concepts that blend modern aesthetics with functionality.</li>
                <li><strong>Attention to Detail</strong> Every element is crafted with precision and care for a flawless finish.</li>
                <li><strong>Timeless Elegance</strong> Designs that remain stylish and relevant, enhancing your space for years to come.</li>
              </ul>
              <p><a href="/contact" className="btn">Contact Us</a></p>
            </div>
          </div>
        </div>
      </div>


      <OurTeam></OurTeam>
      <Testimonials></Testimonials>



    </>
  );
}

export default Home;
