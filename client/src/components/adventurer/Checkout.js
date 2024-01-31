import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Button, Card, Col, Container, Row} from 'react-bootstrap'
import styles from './index.module.css';


export default function Checkout() {

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState([]);
    const [order, setOrder] = useState([])


    const getCart = async (token) => {
        try {
            const res = await axios.get('cart', {
            headers: { Authorization: token },
            })
            setCart(res.data.products);
            setTotal(res.data.total)
        } catch (error) {
            console.log(error)
        }
    };  

    const createOrder = async (token) => {
        try {
            const cartArray = cart.map((loot) => ({
                productId: loot.product,
                quantity: loot.quantity,
            }));
            const token = localStorage.getItem('tokenStore');
            const res = await axios.post('/order', { productsArray: cartArray }, {
                headers: { Authorization: token }
            });
            setOrder(res.data.order);

            const result = await axios.post('/checkout', {orderId: res.data.order._id}, {
                headers: { Authorization: token }
            })
            if(result.data.status === true){

                const authorizationUrl = result.data.data.authorization_url;
                console.log(authorizationUrl);

                window.location.replace(authorizationUrl);
            }
            console.log(result.data)
        } catch (error) {
            console.log(error);
        }
    };     
    console.log(order);

    useEffect(() => {
        const token = localStorage.getItem('tokenStore')
        if (token) {
        getCart(token)
        }
    }, [])
    

  return (
    <>
        <Container className={styles.checkoutPage}>
            <section className={styles.checkout}>
                <h1 className={styles.checkoutTitle}>CHECKOUT</h1>
                    <Card className={styles.orderDetail}>
                        <Card.Header><h1 className={styles.checkoutOrderTitle}>Order Details</h1></Card.Header>
                        <Card.Body>
                        {
                            cart.map(cartItem => (
                                <Row className={styles.checkoutOrder} key={cartItem._id}>
                                    <Col>
                                        <img src={require(`../../../../Images/${cartItem.product.imageName}`)} alt='cart item'className={styles.miniCheckoutOrderPic}/>
                                    </Col>
                                    <Col>
                                        <h1 className={styles.orderDetailText}>{cartItem.product.productName}</h1>
                                        <h1 className={styles.miniCartOrderQty}>
                                            <Row>
                                                <Col><p className={styles.orderDetailText}>X</p></Col>
                                                <Col><p className={styles.orderDetailText}>{cartItem.quantity}</p></Col>
                                            </Row>
                                        </h1>
                                        <h1><p className={styles.orderDetailText}>£ {cartItem.quantity * cartItem.product.price}</p></h1>
                                    </Col>
                                </Row>
                            ))
                        }
                        </Card.Body>
                        <Card.Footer>
                            <div className={styles.checkoutCardTotal}>
                                <Row>
                                    <Col><p className={styles.orderDetailTitle}>Total:</p></Col>
                                    <Col><p className={styles.orderDetailTitle}>£ {total}</p></Col>
                                </Row>
                            </div>
                        </Card.Footer>
                    </Card>
                    <Button onClick={createOrder} className={styles.miniCheckoutBtn} ><p className={styles.miniCartBtnText}>PAY</p></Button>
            </section>
        </Container>
    </>
  )
}
