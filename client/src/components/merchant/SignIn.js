import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styles from './index.module.css'

import { useNavigate } from 'react-router-dom';
import { Card, Container, Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

export default function MerchantSignIn() {
    const navigate = useNavigate();
    const [seller, setSeller] = useState({ email: '', password: ''})
    const [err, setErr] = useState('')
    const location = useLocation();
    const backgroundClass = location.pathname === '/merchant/login' ? `${styles.AppRegister}` : `${styles.App}`; 
    const [isLogin, setIsLogin] = useState([])

    if (window.location.pathname === '/merchant/login') {
        localStorage.clear();
      }

    useEffect(() =>{
        const checkLogin = async () =>{
            const token = localStorage.getItem('tokenStore')
            console.log(token)
            if(token){
              const verified = await axios.get('/seller/verify/m',{
                headers:{ Authorization: token}
              })
              console.log(verified)
              setIsLogin(verified.data)
              console.log(isLogin)
              if(verified.data === false) return localStorage.clear()
            }else{
              setIsLogin(false)
            }
          }
          checkLogin()
    }, [])

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setSeller({ ...seller, [name]:value})
        setErr('')
    }

    const loginSubmit = async e =>{
      e.preventDefault()
      try {
          const res = await axios.post('/seller/login',{
            email: seller.email,
            password: seller.password
          })
          setSeller({name: '', email: '', password: ''})
          localStorage.setItem('tokenStore', res.data.Token)
          setIsLogin(true)
          const id = res.data.seller.id
          console.log(id)
          navigate(`/seller/${id}/shop`)
      } catch (error) {
        console.log(error)
      }
    }
    
  return (
         <Container fluid className={`app-container ${backgroundClass}`}>
            <Card fluid className={styles.SignUpCard}>
                <Card.Body className={styles.SignUpCardBody}>
                    <h1 className={styles.registerHeader}>login</h1>
                    <Form onSubmit={loginSubmit} action="/api/login" method="POST">
                        <Form.Group className="mb-3" controlId="login-email">
                            <Form.Control type="email" placeholder="Email address" className={styles.inputLine} name='email' value={seller.email} onChange={onChangeInput} required/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="login-password">
                            <Form.Control type="password" placeholder="Password" autoComplete='off' className={styles.inputLine} name='password' value={seller.password} onChange={onChangeInput} required/>
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                        <Button type="submit" className={styles.registerBtn}>
                            LOGIN
                        </Button>
                        </div>
                    </Form>
                    <p className={styles.loginText}>Don’t have an account?&nbsp; <a href='/register'>Sign up!</a></p>
                </Card.Body>
                <h3 className={styles.errText}>{err}</h3>
            </Card>
        </Container>
    )
}
