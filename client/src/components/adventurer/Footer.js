import React from 'react';
import styles from './index.module.css';
import logo from "../images/logo.png"
import { Col, Row, Nav, Navbar } from 'react-bootstrap'


export default function Footer() {
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
                            <li className={styles.listHeader}>About Us</li>
                            <li className={styles.listItem}>Careers</li>
                            <li className={styles.listItem}>Blog</li>
                            <li className={styles.listItem}>About Steezed</li>
                            <li className={styles.listItem}>Investor Relations</li>
                            <li className={styles.listItem}>Steezed Science</li>
                        </ul>
                    </Col>
                    <Col className="p-0">
                        <ul className="list-unstyled p-0">
                            <li className={styles.listHeader}>Collaborate</li>
                            <li className={styles.listItem}>Sell products on Steezed</li>
                            <li className={styles.listItem}>Sell on Steezed</li>
                            <li className={styles.listItem}>Sell apps on Steezed</li>
                            <li className={styles.listItem}>Become an Affiliate</li>
                            <li className={styles.listItem}>Advertise Your Products</li>
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