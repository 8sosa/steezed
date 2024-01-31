import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css'
import { Card, Container, Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

export default function MerchantSignUp() {
    const navigate = useNavigate();
    const [seller, setSeller] = useState({ userName: '', email: '', password: '', phoneNumber: '', shopName: '', shopAddress: '' })
    const [err, setErr] = useState('')
    const location = useLocation();
    const backgroundClass = location.pathname === '/m/seller/register' ? `${styles.AppRegister}` : `${styles.App}`; 

    if (window.location.pathname === '/m/seller/register') {
        localStorage.removeItem('tokenStore');
    }
    
    const onChangeInput = e =>{
        const {name, value} = e.target;
        setSeller({ ...seller, [name]:value})
        setErr('')
    }

  const registerSubmit = async e =>{
    e.preventDefault()
    try {
        const res = await axios.post('/seller/register', {
            userName: seller.userName,
            shopName: seller.shopName,
            shopDescription: seller.shopDescription,
            email: seller.email,
            password: seller.password,
            phoneNumber: seller.phoneNumber,
            shopAddress: seller.shopAddress
        })
        setSeller({ userName: '', shopName: '', shopDescription: '', email: '', password: '', phoneNumber: '', shopAddress: '' })
        setErr(res.data.msg)
        navigate('/m/seller/login');
    } catch (error) {
        setErr(error);
        console.log(error);
    }
}


  return (
    <>
        <Container fluid className={`app-container ${backgroundClass}`}>
            <Card className={styles.SignUpCard}>
                <Card.Body className={styles.SignUpCardBody}>
                    <h1 className={styles.registerHeader}>REGISTER</h1>
                    <Form onSubmit={registerSubmit} name='merchant'>
                        <Form.Group className="mb-3" controlId="register-shopName">
                            <Form.Control type="text" placeholder="Shop Name" className={styles.inputLine} name='shopName' value={seller.shopName} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-shopAddress">
                            <Form.Control type="text" placeholder="Shop Address" className={styles.inputLine} name='shopAddress' value={seller.shopAddress} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-shopDescription">
                            <Form.Control type="text" placeholder="Shop Description" className={styles.inputLine} name='shopDescription' value={seller.shopDescription} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-PhoneNumber">
                            <Form.Control type="tel" placeholder="Phone Number" className={styles.inputLine} name='phoneNumber' value={seller.phoneNumber} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-UserName">
                            <Form.Control type="num" placeholder="Username" className={styles.inputLine} name='userName' value={seller.userName} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-email">
                            <Form.Control type="email" placeholder="Email shopAddress" className={styles.inputLine} name='email' value={seller.email} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-password">
                            <Form.Control type="password" placeholder="Password" autoComplete='off' className={styles.inputLine} name='password' value={seller.password} onChange={onChangeInput} required/>
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                        <Button type="submit" className={styles.registerBtn}>
                            REGISTER
                        </Button>
                        </div>
                    </Form>
                    <p className={styles.loginText}>Already have an account?&nbsp;<a href='/m/seller/login' className={styles.loginLink}> Sign In!</a></p>
                </Card.Body>
                <h3 className={styles.errText}>{err}</h3>
            </Card>
        </Container>
    </>
    )
}
