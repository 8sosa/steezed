import React from 'react';
import logo from "../images/logo.png"
import { Col, Row, Nav, Navbar } from 'react-bootstrap'
import style from './index.module.css'


export default function Footer() {
  return (
    <>
        <div className={style.footer}>
            <div className={style.footerMain}>
                <Col className={style.footerLogoBox}>
                    <img src={logo} alt="Your Logo" className={style.footerLogo}/>
                </Col>
                <Col className={style.footerLinkBox}>
                <Row className={style.footerLinks}>
                    <Col>
                        <ul className="list-unstyled">
                            <li className={style.listHeader}>About Us</li>
                            <li className={style.listItem}>Careers</li>
                            <li className={style.listItem}>Blog</li>
                            <li className={style.listItem}>About Steezed</li>
                            <li className={style.listItem}>Investor Relations</li>
                            <li className={style.listItem}>Steezed Science</li>
                        </ul>
                    </Col>
                    <Col className="p-0">
                        <ul className="list-unstyled p-0">
                            <li className={style.listHeader}>Collaborate</li>
                            <li className={style.listItem}>Sell products on Steezed</li>
                            <li className={style.listItem}>Sell on Steezed</li>
                            <li className={style.listItem}>Sell apps on Steezed</li>
                            <li className={style.listItem}>Become an Affiliate</li>
                            <li className={style.listItem}>Advertise Your Products</li>
                        </ul>
                    </Col>
                </Row>
                </Col>
            </div>
            <div className={style.footer}>
                <Navbar  className={style.footerBottom}>
                    <Row>
                        <Nav className="me-auto">
                            <Nav.Link className={style.footerText}>Terms of use</Nav.Link>
                            <Nav.Link className={style.footerText}>Privacy policy</Nav.Link>
                            <Nav.Link className={style.footerText}>Accessibility statement</Nav.Link>
                        </Nav>
                    </Row>
                    <Row>
                        <Navbar.Text className={style.footerText}>
                            © Copyright 2023 <span className={style.steezed}>STEEZED</span> All Rights Reserved.
                        </Navbar.Text>
                    </Row>
                </Navbar>
            </div>
        </div>
    </>
  )
}