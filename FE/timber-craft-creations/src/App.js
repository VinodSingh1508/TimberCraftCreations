import Home from "./components/Home";
import Shop from "./components/Shop";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Cookies from 'js-cookie';
import {Routes, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';
import api from './api/axiosConfig';
import Contact from "./components/Contact";
// import Services from "./components/Services";
import Thankyou from "./components/Thankyou";
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from "./components/Admin";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null);
  const [products, setProducts] = useState();
  const getProducts = async () => {

    try {

        const response = await api.get("/product/getAll");

        setProducts(response.data);

    }
    catch (err) {
        console.log(err);
    }
}
useEffect(() => {
    getProducts();
}, [])

  return (
    <div className="App">
      <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}></Header>
      <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/shop" element={<Shop products={products} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
          <Route path="/cart" element={<Cart products={products} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
          <Route path="/checkout" element={<Checkout products={products} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/services" element={<Services />} /> */}
          <Route path="/thankyou" element={<Thankyou />} />
          <Route path="/admin" element={<Admin products={products} />} />
          {/* <Route path="*" element = {<NotFound/>} /> */}
      </Routes>
      <Footer loggedInUser={loggedInUser}></Footer>
    </div>
  );
}

export default App;
