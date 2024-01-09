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
    const [file, setFile] = useState()
    const location = useLocation();
    const backgroundClass = location.pathname === '/seller/register' ? `${styles.AppRegister}` : `${styles.App}`; 

    if (window.location.pathname === '/seller/register') {
        localStorage.clear();
    }
    
    const onChangeInput = e =>{
        const {name, value} = e.target;
        setSeller({ ...seller, [name]:value})
        setErr('')
    }

  const registerSubmit = async e =>{
    e.preventDefault()
    try {
        const form = document.forms.namedItem("merchant");
        const formData = new FormData(form)
        const res = await axios.post('/seller/register', formData)
        console.log('third')
        console.log(file)
        console.log(res)
        navigate('/');
    } catch (err) {
        setErr(err.response.data.msg)
        console.log(err)
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
                        <Form.Group className='mb-3'>
                            <input name='file' type='file' onChange={e => setFile(e.target.files[0])}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-shopAddress">
                            <Form.Control type="text" placeholder="Shop Address" className={styles.inputLine} name='shopAddress' value={seller.shopAddress} onChange={onChangeInput} required/>
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
                    <p className={styles.loginText}>Already have an account?&nbsp;<a href='/seller/login' className={styles.loginLink}> Sign In!</a></p>
                </Card.Body>
                <h3 className={styles.errText}>{err}</h3>
            </Card>
        </Container>
    </>
    )
}
