import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import { Container } from 'react-bootstrap'
import styles from './index.module.css';
import axios from 'axios';
import Pic from '../images/7990317.jpg'



export default function Payment() {
  const {orderid} = useParams();
  const [order, setOrder] = useState([]);
  const [shopper, setShopper] = useState([]);

  // const verifyPayment = async (token) => {
  //   try {
  //     const res = await axios.get(`/checkout/${orderid}`, {
  //       headers: {Authorization: token}
  //     })
  //     console.log('res.data')
  //     console.log(res.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  const getShopper = async (token, shopperId) => {
    try {
      const res = await axios.get(`/shopper/${shopperId}`, {
        headers: {Authorization: token}
      })
      setShopper(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  const getOrder = async (token) => {
    try {
      const res = await axios.get(`/order/${orderid}`, {
        headers: {Authorization: token}
      })
      setOrder(res.data)
      getShopper(token, res.data.shopper)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(order)

  useEffect(() => {
    const token = localStorage.getItem('tokenStore')
    if (token) {
      // verifyPayment(token)
      getOrder(token)
    }
  }, [])

  return (
    <>
      <Container className={styles.payPage}>
        <img src={Pic} alt='payment successful' className={styles.payVector}/>
        <h1 className={styles.paymentTitle}>PAYMENT SUCCESSFUL!</h1>
        <p className={styles.paymentText}>Order placed, Thank you for shopping here {shopper.userName}.</p>
      </Container>
    </>
  )
}
