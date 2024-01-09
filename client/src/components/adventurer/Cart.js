import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { Card, Col, Button, ButtonGroup, Container, Row } from 'react-bootstrap'
import { CiTrash } from "react-icons/ci";
import { BiPlus, BiMinus } from "react-icons/bi"



export default function Cart() {

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState([]);
    const [order, setOrder] = useState([]);
    const navigate = useNavigate();

    const getCart = async (token) => {
        try {
          const res = await axios.get('/cart', {
            headers: { Authorization: token }
          })
          setCart(res.data.products);
          setTotal(res.data.total)
        } catch (error) {
            console.log(error)
        }
    }

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


    const handleIncreaseQuantity = (productId, currentQuantity) => {
        const newQuantity = currentQuantity + 1;
        updateQuantity(productId, newQuantity);
    };
    
    const handleDecreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
          const newQuantity = currentQuantity - 1;
          updateQuantity(productId, newQuantity);
        } else if (currentQuantity === 1) {
            console.log('Removing Product')
            const newQuantity = currentQuantity - 1;
            updateQuantity(productId, newQuantity);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            console.log(productId)
            const token = localStorage.getItem('tokenStore'); // Retrieve the token
            const res = await axios.put(`cart/${productId}`, { quantity: newQuantity }, { headers: { Authorization: token } });
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    };

    const removeProduct = async (productId) => {
        try {
            const token = localStorage.getItem('tokenStore'); // Retrieve the token
            const res = await axios.delete(`cart/${productId}`, { headers: { Authorization: token } });
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
   
    useEffect(() => {
        const token = localStorage.getItem('tokenStore')
        if (token) {
          getCart(token)
        } else {
            navigate('/login')
        }
    }, [])

  return (
    <>
        <Container className={styles.itemPage}>
            <section className='d-flex justify-content-center'> 
                    <Card className={styles.cart}>
                        <Card.Header className={styles.cartTitle}>Cart</Card.Header>
                        <Card.Body className={styles.cartBody}>
                            <div>
                                {
                                    cart.map(cartItem => (
                                        <div key={cartItem._id}>
                                            <Row className={styles.cartOrder}>
                                                <Col xs={6} lg={3}>
                                                    <img src={require(`../../../../Images/${cartItem.product.imageName}`)} className={styles.cartImage} alt='loot'/>
                                                </Col>
                                                <Col>
                                                    <p className={styles.cartOrderTitle}>{cartItem.product.productName}</p>
                                                    <Row className='d-flex align-items-center'>
                                                        <Col>
                                                            <p className={styles.cartOrderText}>Unit Price : {cartItem.product.price}</p>
                                                        </Col>
                                                        <Col>
                                                            <div className='d-flex'>
                                                                <ButtonGroup aria-label="Basic example" className={styles.qtyBtn}>
                                                                    <Button variant="secondary" className={styles.minusBtn} onClick={() => handleDecreaseQuantity(cartItem.product._id, cartItem.quantity)}><BiMinus /></Button>
                                                                    <Button variant="secondary" className={styles.numBtn} disabled value={JSON.stringify(cartItem.quantity)}>{cartItem.quantity}</Button>
                                                                    <Button variant="secondary" className={styles.plusBtn} onClick={() => handleIncreaseQuantity(cartItem.product._id, cartItem.quantity)}><BiPlus /></Button>
                                                                </ButtonGroup>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className='d-flex align-items-center mt-2'>
                                                        <Col>
                                                            <p className={styles.cartOrderText}>Total Price : {cartItem.product.price * cartItem.quantity}</p>
                                                        </Col>
                                                        <Col>
                                                            <div className='d-flex'>
                                                                <Button className={styles.delBtn} onClick={() => removeProduct(cartItem.product._id)}><CiTrash/></Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))
                                }
                                
                            </div>
                        </Card.Body>
                        <Card.Footer className={styles.cartFooter}>
                            <h1 className={styles.cartOrderTitle}>Cart Total: # {total}</h1>
                            <Button onClick={createOrder} className={styles.cartBtn}><p className={styles.miniCartBtnText}>CHECKOUT</p></Button>
                        </Card.Footer>
                    </Card>
            </section>
        </Container>
    </>
  )
}
