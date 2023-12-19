import React from 'react';
import style from './index.module.css'
import { Button, Container, Nav, Navbar, Form } from 'react-bootstrap'
import { IoAddSharp } from "react-icons/io5"
import { GoSearch } from "react-icons/go"
import logo from '../images/logo.png'

export default function NavBar() {

  return (
    <>
        <Navbar expand="md" className={style.merchantNavbar}>
            <Container fluid>
                <Navbar.Brand href="/" className={style.logo}>
                    <img src={logo} alt="Your Logo" className={style.logoImage}/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id='responsive-navbar-nav' className={style.mininav}>
                    <Form className="d-flex mx-auto">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className={style.searchField}
                        aria-label="Search"
                        />
                        <Button variant="outline-success" className={style.navSearchBtn}><GoSearch /></Button>
                    </Form>
                        <Nav className="ms-auto justify-content-end justify-space-between align-items-center ">
                            <Button href='/cart' className={style.navCartBtn}>
                                <IoAddSharp className={style.navCartBtnIcon}/>
                                Create
                            </Button>
                        </Nav> 
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
  )
}