import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap'
import style from './index.module.css';


export default function SignIn () {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({ email: '', password: ''})
    const [isLogin, setIsLogin] = useState([])
    const [err, setErr] = useState('')
    
    const onChangeInput = e =>{
        const {name, value} = e.target;
        setAdmin({ ...admin, [name]:value})
        setErr('')
    }

    const checkLogin = async () => {
        const token = localStorage.getItem('tokenStore')
        if (token) {
            const verified = await axios.get('/secret/admin/verify/a', {
                headers: { Authorization: token}
            })
            setIsLogin(verified.data)
            if (verified.data === false) {
                localStorage.clear();
            }
        } else {
            setIsLogin(false)
        }
    }

    const Login = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/secret/admin/login', {
                email: admin.email,
                password: admin.password
            });
            setAdmin({ email: '', password: ''});
            setIsLogin(true);
            localStorage.setItem('tokenStore', res.data.Token)
            navigate('/a/secret/admin/')
        } catch (error) {
            setErr(error.response.data.error)
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await checkLogin();
        };

        fetchData();
    }, [isLogin]);

  return (
    <>
        <Container className='d-flex flex-column align-items-center justify-content-center'>
            <div className={style.logBox}>
                <h1 className={style.logBoxTitle}>admin login</h1>
                <Form onSubmit={Login} className={style.logBoxForm}>
                    <Form.Group className={style.logBoxFormInput} controlId="register-email">
                        <Form.Control type="email" placeholder="Email" className={style.inputLine} name='email' value={admin.email} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Form.Group className={style.logBoxFormInput} controlId="register-password">
                        <Form.Control type="password" placeholder="Password" className={style.inputLine} name='password' value={admin.password} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Button type='submit' className={style.logBoxBtn}>Login</Button>
                </Form>
                <h1 className={style.logBoxErr}>{err}</h1>
            </div>
        </Container>
    </>
  )
}