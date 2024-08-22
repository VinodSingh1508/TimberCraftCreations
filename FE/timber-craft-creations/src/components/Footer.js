import { useState } from "react";
import FooterModal from "./FooterModal";
import NewsLetter from "./NewsLetter";

function Footer({loggedInUser}) {
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  return (<>
    <footer className="footer-section">
      <div className="container relative">

        <div className="sofa-img">
          <img src="/images/sofa.png" alt="Image" className="img-fluid" />
        </div>

        <NewsLetter loggedInUser={loggedInUser}></NewsLetter>

        <div className="row g-5 mb-5">
          <div className="col-lg-12">
            <div className="mb-4 footer-logo-wrap"><a href="#" className="footer-logo">TimberCraft Creations</a></div>
            <p className="mb-4">At TimberCraft Creations, we specialize in crafting custom-made wooden furniture that brings elegance and functionality to your home. Each piece is meticulously handcrafted to meet your unique specifications.</p>

            <ul className="list-unstyled custom-social">
              <li><a href="https://www.facebook.com/" target="_blank"><span className="fa fa-brands fa-facebook-f"></span></a></li>
              <li><a href="https://x.com/" target="_blank"><span className="fa fa-brands fa-twitter"></span></a></li>
              <li><a href="https://www.instagram.com/" target="_blank"><span className="fa fa-brands fa-instagram"></span></a></li>
              <li><a href="https://www.linkedin.com/" target="_blank"><span className="fa fa-brands fa-linkedin"></span></a></li>
            </ul>
          </div>

        </div>

        <div className="border-top copyright">
          <div className="row pt-4">
            <div className="col-lg-6">
              <p className="mb-2 text-center text-lg-start">Copyright &copy;{new Date().getFullYear()}. All Rights Reserved. &mdash; Designed with love.
              </p>


            </div>

            <div className="col-lg-6 text-center text-lg-end">
              <ul className="list-unstyled d-inline-flex ms-auto">
                <li className="me-4"><a href="#" onClick={(e) => { e.preventDefault(); setModalType("tnc"); setModalShow(true); }}>Terms &amp; Conditions</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setModalType("pp"); setModalShow(true); }}>Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </footer>
    
    <FooterModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            modalType={modalType}
                        />
  </>);
}

export default Footer;
