import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styles from './index.module.css'
import { useNavigate } from 'react-router-dom';
import { Card, Container, Form, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

export default function SignIn() {
  const navigate = useNavigate();
  const [shopper, setShopper] = useState({ email: '', password: ''})
  const [err, setErr] = useState('')
  const location = useLocation();
  const backgroundClass = location.pathname === '/login' ? `${styles.AppRegister}` : `${styles.App}`; 
  const [isLogin, setIsLogin] = useState([])
  if (window.location.pathname === '/login') {
    localStorage.clear();
  }

  const checkLogin = async () =>{
    const token = localStorage.getItem('tokenStore')
    if(token){
      const verified = await axios.get('/shopper/verify/a',{
        headers:{ Authorization: token}
      })
      setIsLogin(verified.data)
      console.log(isLogin)
      if(verified.data === false) return localStorage.clear()
    }else{
      setIsLogin(false)
    }
  }
  
  const onChangeInput = e =>{
    const {name, value} = e.target;
    setShopper({ ...shopper, [name]:value})
    setErr('')
  }

  const loginSubmit = async e =>{
    e.preventDefault()
    try {
        const res = await axios.post('/shopper/login',{
            email: shopper.email,
            password: shopper.password
        })
        setShopper({email: '', password: ''})
        setIsLogin(true)
        localStorage.setItem('tokenStore', res.data.Token)
        navigate('/')
      } catch (error) {
        setErr(error.response.data.msg)
      console.log(error)
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      await checkLogin();
    };

    fetchData();
  }, []);
  return (
    <>
      <Container fluid className={`app-container ${backgroundClass}`}>
        <Card fluid className={styles.SignUpCard}>
            <Card.Body className={styles.SignUpCardBody}>
                <h1 className={styles.registerHeader}>login</h1>
                <Form onSubmit={loginSubmit} action="/api/login" method="POST">
                    <Form.Group className="mb-3" controlId="login-email">
                        <Form.Control type="email" placeholder="Email address" className={styles.inputLine} name='email' value={shopper.email} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="login-password">
                        <Form.Control type="password" placeholder="Password" autoComplete='off' className={styles.inputLine} name='password' value={shopper.password} onChange={onChangeInput} required/>
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
    </>
    )
}
