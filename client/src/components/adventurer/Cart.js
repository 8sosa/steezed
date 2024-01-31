import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import { Card, Col, Button, ButtonGroup, Container, Row } from 'react-bootstrap';
import { CiTrash } from "react-icons/ci";
import { BiPlus, BiMinus } from "react-icons/bi";
import checkLogin from './auth';


export default function Cart() {

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState([]);
    const [err, setErr] = useState('')
    const navigate = useNavigate();


    const getCart = async () => {
        try {
            const token = localStorage.getItem('tokenStore');
          const res = await axios.get('/cart', {
            headers: { Authorization: token }
          })
          setCart(res.data.products);
          setTotal(res.data.total)
        } catch (error) {
            console.log(error)
        }
    }

    const createOrder = async () => {
        try {
            const cartArray = cart.map((loot) => ({
                productId: loot.product,
                quantity: loot.quantity,
            }));
            const token = localStorage.getItem('tokenStore');
            const res = await axios.post('/order', { productsArray: cartArray }, {
                headers: { Authorization: token }
            });
            const result = await axios.post('/checkout', {orderId: res.data.order._id}, {
                headers: { Authorization: token }
            })
            if(result.data.status === true){

                const authorizationUrl = result.data.data.authorization_url;
                console.log(authorizationUrl);

                window.location.replace(authorizationUrl);
            }
        } catch (error) {
            setErr(error.response.data.error)
            console.log(error);
        }
    };


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
            const token = localStorage.getItem('tokenStore'); // Retrieve the token
            await axios.put(`cart/${productId}`, { quantity: newQuantity }, { headers: { Authorization: token } });
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
        const fetchData = async () => {
            const isUserLoggedIn = await checkLogin();

            if (isUserLoggedIn) {
                const token = localStorage.getItem('tokenStore')
                if (token) {
                getCart(token)
                }
            }  else {
                navigate('/login')
            }
        }
        
        fetchData();
    }, [cart])

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

  return (
    <>
        <Container className={styles.homePage}>
            <section className={styles.cartSection}>
                <Card>
                    <Card.Header className={styles.cartTitle}>Cart</Card.Header>
                    <Card.Body className={styles.cartBody}>
                            {cart.length === 0 ? (
                                <p className={styles.cartOrderTitle}>Your cart is empty adventurer.</p>
                            ) : (
                                cart.map(cartItem => (
                                    <Row xs={2} className={styles.cartOrder} key={cartItem._id}>
                                        <Col xs={6}>
                                            <img src={require(`../../../../Images/${cartItem.product.imageName}`)} className={styles.cartImage} alt='loot'/>
                                            <p className={styles.cartOrderTitle}>{cartItem.product.productName}</p>
                                            <p className={styles.cartOrderText}>Unit Price : {cartItem.product.price}</p>
                                            <p className={styles.cartOrderText}>Total Price : {cartItem.product.price * cartItem.quantity}</p>
                                        </Col>
                                        <Col xs={6}>
                                            <div className={styles.qtyBtnBlock}>
                                                <ButtonGroup aria-label="Basic example" className={styles.qtyBtn}>
                                                    <Button variant="secondary" className={styles.minusBtn} onClick={() => handleDecreaseQuantity(cartItem.product._id, cartItem.quantity)}><BiMinus /></Button>
                                                    <Button variant="secondary" className={styles.numBtn} disabled value={JSON.stringify(cartItem.quantity)}>{cartItem.quantity}</Button>
                                                    <Button variant="secondary" className={styles.plusBtn} onClick={() => handleIncreaseQuantity(cartItem.product._id, cartItem.quantity)}><BiPlus /></Button>
                                                </ButtonGroup>
                                                <Button className={styles.delBtn} onClick={() => removeProduct(cartItem.product._id)}><CiTrash/></Button>
                                            </div>
                                        </Col>
                                    </Row>
                                ))
                                )}
                    </Card.Body>
                    <Card.Footer className='d-flex flex-column'>
                        <p className={styles.cartOrderTitle}>{err}</p>
                        <div className={styles.cartFooter}>
                            <h1 className={styles.cartOrderTitle}>Cart Total: # {total}</h1>
                            <Button onClick={createOrder} className={styles.miniCartBtn}><p className={styles.miniCartBtnText}>CHECKOUT</p></Button>
                        </div>
                    </Card.Footer>
                </Card>
            </section>
            
        </Container>
    </>
  )
}
