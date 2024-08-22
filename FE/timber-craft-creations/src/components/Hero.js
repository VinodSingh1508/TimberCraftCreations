
function Hero() {
  return (
    <div className="hero">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-5">
            <div className="intro-excerpt">
              <h1>Crafted Elegance <span clsas="d-block">for every space.</span></h1>
              <p className="mb-4">Where craftsmanship meets elegance.</p>
              {/* <p>
                <a href="/shop" className="btn btn-secondary me-2">Shop Now</a>
                <a href="/services" className="btn btn-white-outline">Explore</a>
              </p> */}
            </div>
          </div>
          <div className="col-lg-7">
            <div className="hero-img-wrap">
              <img src="/images/couch.png" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Hero;
