import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineShoppingCart } from "react-icons/hi";
import logo from "../images/logo.png";
import profile from "../images/profile.png";
import SearchBar from '../SearchBar';

export default function NavBar() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [id, setId] = useState('');
  const [cart, setCart] = useState([]);

  const logout = () => {
    localStorage.clear();        
    navigate('/')
  };

  const getCart = async (token) => {
    try {
      const res = await axios.get('/cart', {
        headers: { Authorization: token }
      });
      setCart(res.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const checkLogin = async () => {
    const token = localStorage.getItem('tokenStore');
    if (token) {
      try {
        const verified = await axios.get('/shopper/verify/a', {
          headers: { Authorization: token }
        });
        if (verified.data && isLogin !== true) {
          setIsLogin(true);
          setId(verified.data.id);
        } else {
          setIsLogin(false);
          setId('');
        }
      } catch (error) {
        console.error("Error while verifying:", error);
        setIsLogin(false);
        setId('');
      }
    } else {
      setIsLogin(false);
      setId('');
    }
  };

  const token = localStorage.getItem('tokenStore');
  useEffect(() => {
    checkLogin();
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('tokenStore');
    if (token) {
      getCart(token);
    }
  }, [cart]); // Only re-run when cart state changes

  return (
    <>
      <Navbar expand="lg" className={styles.navbar}>
        <Container fluid>
          <Navbar.Brand href="/" className={styles.logo}>
            <img src={logo} alt="Your Logo" className={styles.logoImage} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id='responsive-navbar-nav' className={styles.minNav}>
            <div className="d-flex justify-content-center m-2">
              <SearchBar />
            </div>
            <div className="d-flex justify-content-end justify-space-between align-items-center ">
              {isLogin
                ? 
                <Nav className={styles.minNavBtns}>
                  <div className={styles.minNavBtn}>
                    <Nav.Link href={`/shopper/${id}`}><img src={profile} alt='profile' className={styles.profileBtn}/></Nav.Link>
                  </div>
                  <div className={styles.minNavBtn}>
                    <Button as={Link} to='/cart' className={styles.navCartBtn}>
                      <HiOutlineShoppingCart/>
                      Cart
                      ({cart.length})
                    </Button>
                  </div>
                  <div className={styles.minNavBtn}>
                    <Nav.Link className={styles.helpBtn} onClick={() => logout()}><IoIosLogOut /></Nav.Link>
                  </div>
                </Nav>
                : 
                <Nav.Link href="/login" className={styles.logBtn}>
                  <h3 className={styles.btnText}>Login</h3>
                </Nav.Link>
              }
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
