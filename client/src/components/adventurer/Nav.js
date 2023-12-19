import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineShoppingCart } from "react-icons/hi";
import logo from "../images/logo.png";
import profile from "../images/profile.png";
import SearchBar from '../SearchBar';

export default function NavBar() {
  const [isLogin, setIsLogin] = useState(false);
  const [id, setId] = useState('')
  const [cart, setCart] = useState([])


  const getCart = async (token) => {
    try {
      const res = await axios.get('/cart', {
        headers: { Authorization: token }
      })
      setCart(res.data.products);
    } catch (error) {
      console.log(error)
    }
}

  const checkLogin = async () => {
    const token = localStorage.getItem('tokenStore');
    if (token) {
      try {
        const verified = await axios.get('/shopper/verify/a', {
          headers: { Authorization: token }
        });
        if (verified.data && isLogin !== true) {
          setIsLogin(true)
          setId(verified.data.id)
        }
        else {
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error while verifying:", error)
        setIsLogin(false)
      }
    } else {
      setIsLogin(false)
    }
  };

  useEffect(() => {
    checkLogin()
    const token = localStorage.getItem('tokenStore')
    if (token){
      getCart(token)
    }
  }, []);

  return (
    <>
      <Navbar expand="md" className={styles.navbar}>
        <Container fluid>
          <Navbar.Brand href="/" className={styles.logo}>
            <img src={logo} alt="Your Logo" className={styles.logoImage} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id='responsive-navbar-nav' className={styles.minNav}>
            <div className="d-flex mx-auto justify-content-center">
              <SearchBar />
            </div>
            <div className="ms-auto justify-content-end justify-space-between align-items-center ">
              {isLogin
                ? 
                <Nav>
                  <div className={styles.minNavBtns}>
                    <Nav.Link href={`/shopper/${id}`}><img src={profile} alt='profile' className={styles.profileBtn}/></Nav.Link>
                    <Button as={Link} to='/cart' className={styles.navCartBtn}>
                      <HiOutlineShoppingCart/>
                      Cart
                      ({cart.length})
                    </Button>
                    <Nav.Link className={styles.helpBtn} 
                      onClick={() => localStorage.clear()}
                    ><IoIosLogOut size={25} /></Nav.Link>
                  </div>
                </Nav>
                : 
                <Link to="/login" className={styles.logBtn}>
                  <h3 className={styles.btnText}>Login</h3>
                </Link>
              }
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
