import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './index.module.css'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'


export default function SignUp() {
    const navigate = useNavigate();
    const [shopper, setShopper] = useState({ firstName: '', lastName: '', userName: '', email: '', password: '', phoneNumber: '', address: '' });
    const [err, setErr] = useState('');
    const location = useLocation();
    const backgroundClass = location.pathname === '/register' ? `${styles.AppRegister}` : `${styles.App}`; 
    
    if (window.location.pathname === '/register') {
        localStorage.clear();
    }

    const onChangeInput = (e) => {
        setShopper({ ...shopper, [e.target.name]: e.target.value });
    };
      
    const Register = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/shopper/register', {
                firstName: shopper.firstName,
                lastName: shopper.lastName,
                userName: shopper.userName,
                email: shopper.email,
                password: shopper.password,
                phoneNumber: shopper.phoneNumber,
                address: shopper.address
            })
            setShopper({ firstName: '', lastName: '', userName: '', email: '', password: '', phoneNumber: '', address: '' })
            setErr(res.data.msg)
            navigate('/login');
        } catch (error) {
            setErr(error);
            console.log(error);
        }
    };
      

  return (
    <>
        <Container fluid className={`app-container ${backgroundClass}`}>
            <Card fluid className={styles.SignUpCard}>
                <Card.Body className={styles.SignUpCardBody}>
                    <h1 className={styles.registerHeader}>REGISTER</h1>
                    <Form onSubmit={Register} name='adventurer'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="register-FirstName">
                                    <Form.Control type="text" name='firstName' value={shopper.firstName} placeholder="First Name" className={styles.inputLine} onChange={onChangeInput} required autoComplete='true'/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="register-LastName">
                                    <Form.Control type="text" placeholder="Last Name" className={styles.inputLine} name='lastName' value={shopper.lastName} onChange={onChangeInput} required autoComplete='true'/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3" controlId="register-UserName">
                            <Form.Control type="text" placeholder="Username" className={styles.inputLine} name='userName' value={shopper.userName} onChange={onChangeInput} required autoComplete='true'/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-PhoneNumber">
                            <Form.Control type="tel" placeholder="Phone Number" className={styles.inputLine} name='phoneNumber' value={shopper.phoneNumber} onChange={onChangeInput} required autoComplete='true'/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-Address">
                            <Form.Control type="text" placeholder="Address" className={styles.inputLine} name='address' value={shopper.address} onChange={onChangeInput} required autoComplete='true'/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-email">
                            <Form.Control type="email" placeholder="Email address" className={styles.inputLine} name='email' value={shopper.email} onChange={onChangeInput} required autoComplete='true'/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="register-password">
                            <Form.Control type="password" placeholder="Password" autoComplete='off' className={styles.inputLine} name='password' value={shopper.password} onChange={onChangeInput} required/>
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                        <Button type="submit" className={styles.registerBtn}>
                            REGISTER
                        </Button>
                        </div>
                    </Form>
                    <p className={styles.loginText}>Already have an account?&nbsp;<a href='/login' className={styles.loginLink}> Sign In!</a></p>
                </Card.Body>
                <h3 className={styles.errText}>{err}</h3>
            </Card>
        </Container>
    </>
    )
}
