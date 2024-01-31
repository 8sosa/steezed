import React, {useState, useEffect} from 'react';
import axios from 'axios';
import styles from './index.module.css';
import logo from "../images/logo.png"
import { Col, Row, Nav, Navbar } from 'react-bootstrap'


export default function Footer() {
    const [isLogin, setIsLogin] = useState(false);
    const [id, setId] = useState('');

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
  return (
      <>
        <div className={styles.footer}>
            <div className={styles.footerMain}>
                <Col className={styles.footerLogoBox}>
                    <img src={logo} alt="Your Logo" className={styles.footerLogo}/>
                </Col>
                <Col className={styles.footerLinkBox}>
                <Row className={styles.footerLinks}>
                    <Col>
                        <ul className="list-unstyled">
                            <li className={styles.listHeader}>Your Steezed</li>
                            <a href={`/p/shopper/${id}`}><li className={styles.listItem}>Your Profile</li></a>
                            <a href={`/p/shopper/${id}`}><li className={styles.listItem}>Your Orders</li></a>
                            <a href={`/p/shopper/${id}`}><li className={styles.listItem}>Your Wishlist</li></a>
                        </ul>
                    </Col>
                    <Col className="p-0">
                        <ul className="list-unstyled p-0">
                            <li className={styles.listHeader}>Collaborate</li>
                            <a href="/m/seller/register"><li className={styles.listItem}>Sell products on Steezed</li></a>
                            <a href="/m/seller/register"><li className={styles.listItem}>Sell on Steezed</li></a>
                            <a href="/m/seller/register"><li className={styles.listItem}>Sell apps on Steezed</li></a>
                        </ul>
                    </Col>
                </Row>
                </Col>
            </div>
            <div className={styles.footer}>
                <Navbar  className={styles.footerBottom}>
                    <Row>
                        <Nav className="me-auto">
                            <Nav.Link className={styles.footerText}>Terms of use</Nav.Link>
                            <Nav.Link className={styles.footerText}>Privacy policy</Nav.Link>
                            <Nav.Link className={styles.footerText}>Accessibility statement</Nav.Link>
                        </Nav>
                    </Row>
                    <Row>
                        <Navbar.Text className={styles.footerText}>
                            © Copyright 2023 <span className={styles.steezed}>STEEZED</span> All Rights Reserved.
                        </Navbar.Text>
                    </Row>
                </Navbar>
            </div>
        </div>
    </>
    
  )
}