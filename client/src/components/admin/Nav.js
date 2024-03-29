import React from 'react';
import style from './index.module.css'
import { Button, Container, Navbar, Form } from 'react-bootstrap'
import { GoSearch } from "react-icons/go"
import logo from '../images/logo.png'

export default function NavBar() {

  return (
    <>
        <Navbar expand="md" className={style.adminNavbar}>
            <Container fluid>
                <Navbar.Brand href="a/secret/admin" className={style.logo}>
                    <img src={logo} alt="Your Logo" className={style.logoImage}/>
                </Navbar.Brand>
                    <Form className={style.search}>
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