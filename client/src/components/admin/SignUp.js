import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './index.module.css';
import { Button, Container, Form } from 'react-bootstrap';


export default function SignUp () {
    const navigate = useNavigate();
    const [err, setErr] = useState('');
    const [admin, setAdmin] = useState({ userName: '', email: '', password: '', phoneNumber: '' });

    if (window.location.pathname.includes('/register')) {
        localStorage.clear();
    }

    const onChangeInput = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
    };

    const Register = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/secret/admin/register', {
                userName: admin.userName,
                email: admin.email,
                password: admin.password,
                phoneNumber: admin.phoneNumber,
                role: admin.role
            })
            setAdmin({ userName: '', email: '', password: '', phoneNumber: '' })
            setErr(res.data.error)
            navigate('/a/secret/admin/login')
        } catch (error) {
            setErr(error)
            console.log(error)
        }
    }

  return (
    <>
        <Container className='d-flex flex-column align-items-center justify-content-center'>
            <div className={style.logBox}>
                <h1 className={style.logBoxTitle}>register admin</h1>
                <Form onSubmit={Register} className={style.logBoxForm}>
                    <Form.Group controlId="register-userName" className={style.logBoxFormInput}>
                        <Form.Control type="text" placeholder="User Name"  name='userName' value={admin.userName} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Form.Group controlId="register-email" className={style.logBoxFormInput}>
                        <Form.Control type="email" placeholder="Email" name='email' value={admin.email} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Form.Group controlId="register-password" className={style.logBoxFormInput}>
                        <Form.Control type="password" placeholder="Password" name='password' value={admin.password} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Form.Group controlId="register-phoneNumber" className={style.logBoxFormInput}>
                        <Form.Control type="text" placeholder="Phone Number" name='phoneNumber' value={admin.phoneNumber} onChange={onChangeInput} required/>
                    </Form.Group>
                    <Button type='submit' className={style.logBoxBtn}>Register</Button>
                </Form>
                <p className={style.logBoxErr}> {err} </p>
            </div>
        </Container>
    </>
  )
}
