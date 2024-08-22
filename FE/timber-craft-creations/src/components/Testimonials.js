import './Testimonials.css';
import Carousel from 'react-bootstrap/Carousel';

const Testimonials = () => {
  let testimonials = [
    {
      id: 1,
      testimonial: "I couldn't be happier with my custom-made dining table from TimberCraft Creations! The craftsmanship is exceptional, and the attention to detail is beyond impressive. It’s not just furniture; it’s a piece of art that perfectly matches my home’s aesthetic.",
      name: "Aditi S",
      place: "Bengaluru, Karnataka"
    }, {
      id: 2,
      testimonial: "TimberCraft Creations delivered exactly what I envisioned—a beautiful, handcrafted bookshelf that fits perfectly in my study. The entire process, from selecting the wood to final delivery, was smooth and professional. Highly recommend!",
      name: "Rohan M",
      place: "Pune, Maharashtra"
    }, {
      id: 3,
      testimonial: "I ordered a custom coffee table for my living room, and it exceeded my expectations! The quality is outstanding, and the team at TimberCraft Creations was incredibly helpful in guiding me through the design options. It’s truly a unique piece that I’ll treasure for years to come.",
      name: "Priya K",
      place: "Chennai, Tamil Nadu"
    }, {
      id: 4,
      testimonial: "The team at TimberCraft Creations brought my dream kitchen island to life. The level of customization they offer is unparalleled, and the end product is both functional and stunning. I’m thrilled with the final result and have received so many compliments on it.",
      name: "Vikram R",
      place: "Hyderabad, Telangana"
    }, {
      id: 5,
      testimonial: "From start to finish, TimberCraft Creations provided an exceptional experience. The custom wardrobe they built for my bedroom is perfect in every way—solid, beautifully finished, and exactly to my specifications. I wouldn’t hesitate to order from them again.",
      name: "Sneha P",
      place: "Mumbai, Maharashtra"
    }

  ];

  return (
    <div className="testimonial-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 mx-auto text-center">
            <h2 className="section-title">Testimonials</h2>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="testimonial-slider-wrap text-center">

              <div className="testimonial-slider"></div>
              <Carousel
                prevIcon={<span className="custom-prev">◀</span>}
                nextIcon={<span className="custom-next">▶</span>}
              >
                {testimonials?.map((tsmn, index) => (
                  <Carousel.Item key={index} style={{ height: '300px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <blockquote style={{ textAlign: 'center', marginBottom: '10px', width:'80%' }}>
                        <p>&ldquo; {tsmn.testimonial} &rdquo;</p>
                      </blockquote>
                      <img
                        className="mx-auto"
                        src={`/images/person${tsmn.id}.jpeg`}
                        alt={`${tsmn.name}`}
                        style={{
                          maxHeight: '100px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                      <div style={{ flex: 1 }} /> {/* This creates space between the image and the caption */}
                    </div>
                    <Carousel.Caption className="custom-caption">
                      <h3>{`${tsmn.name}`}</h3>
                      <p>{tsmn.place}</p>
                    </Carousel.Caption>
                  </Carousel.Item>



                ))}
              </Carousel>

            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default Testimonials;
