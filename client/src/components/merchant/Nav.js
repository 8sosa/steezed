import React from 'react';
import style from './index.module.css'
import { Button, Container, Navbar, Form } from 'react-bootstrap'
import { GoSearch } from "react-icons/go"
import logo from '../images/logo.png'

export default function NavBar() {

  return (
    <>
        <Navbar expand="md" className={style.merchantNavbar}>
            <Container fluid className='d-flex flex-row'>
                <Navbar.Brand className={style.logo}>
                    <img src={logo} alt="Your Logo" className={style.logoImage}/>
                </Navbar.Brand>
                <Form className="d-flex">
                    <Form.Control
                    type="search"
                    placeholder="Search"
                    className={style.searchField}
                    aria-label="Search"
                    />
                    <Button variant="outline-success" className={style.navSearchBtn}><GoSearch /></Button>
                </Form>
            </Container>
        </Navbar>
    </>
  )
}