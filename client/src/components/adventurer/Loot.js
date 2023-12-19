import React, { useEffect, useState} from 'react'
import axios from 'axios'
import styles from './index.module.css';
import {useParams, useNavigate} from 'react-router-dom'
import { Card, Col, Button, ButtonGroup, ButtonToolbar, Container, Row , Offcanvas} from 'react-bootstrap'
import { CiShoppingCart, CiHeart } from "react-icons/ci";
import CategoryProductCard from '../CategoryProductCard'
import { BiPlus, BiMinus } from "react-icons/bi"
import { CiTrash } from "react-icons/ci";



export default function Loot(props) {

    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState({});
    const [accessToken, setAccessToken] = useState("");
    const {_id} = useParams();
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [wishlist, setWishlist] = useState([])
    const [categoryProducts, setCategoryProducts] = useState([])
   
    const getProductById = async () =>{
        try {
            if (_id) {
                const res = await axios.get(`/api/products/${_id}`)
                setProduct(res.data)
                getCategoryProducts(res.data.category)
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };
    const getCategoryProducts = async (category_id) => {
        try {
            const res = await axios.get(`/category/${category_id}/products`);
            setCategoryProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    console.log(categoryProducts)

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
            console.log(productId)
            const token = localStorage.getItem('tokenStore');
            const res = await axios.put(`/cart/${productId}`, { quantity: newQuantity }, { headers: { Authorization: token } });
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    };

    const removeProduct = async (productId) => {
        try {
            const token = localStorage.getItem('tokenStore');
            const res = await axios.delete(`/cart/${productId}`, { headers: { Authorization: token } });
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddToCart = async () => {
        try {
            if (!accessToken) {
                // Redirect to the login page
                navigate('/login');
                return;
              }
          const res = await axios.post(`/cart/${_id}`, {
            productId: product._id,
            quantity: quantity
          }, {
            headers: { Authorization: accessToken }
          });
          setCart(res.data.products);
          setTotal(res.data.total)
          console.log(res.data.products)
          handleShow()
        } catch (error) {
            if (error.response && error.response.status === 401) {
              // Token expired or unauthorized, redirect to login
              navigate('/login');
            } else {
              console.log('Error adding product to cart:', error);
            }
          }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const addToWishlist = async () => {
        try {
            const res = await axios.post('/wishlist', {product_id: product._id}, {
                headers: { Authorization: accessToken }
              })
            setWishlist(res.data)
            console.log(wishlist)
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getProductById()
        const token = localStorage.getItem('tokenStore')
        if (token) {
            setAccessToken(token)
            getCart(token)
        } 
    }, [])

  return (
    <>
        <Container className={styles.itemPage}>
            <Container className={styles.itemDetails}>
                <Row className={styles.itemRow}>
                    <Col>
                    <Card className={styles.itemCard}>
                            {product.imageName && (
                                <img src={require(`../../../../Images/${product.imageName}`)} alt='product' className={styles.itemImg}/>
                            )}                        
                    </Card>
                    </Col>
                    <Col>
                        <h1 className={styles.itemTitle} title={product.productName}>{product.productName}</h1>
                        <p className={styles.itemDescription}>{product.description}</p>
                        <p className={styles.itemDescription}><span className={styles.itemAtt}>Price: </span> # {product.price}</p>
                        <p className={styles.itemDescription}><span className={styles.itemAtt}>Limited Availability: </span> {product.quantity} pieces in stock.</p>
                        <Row className={styles.itemQty}>
                            <Col><p className={styles.itemAtt}>Qty:</p> </Col>
                            <Col>
                                <ButtonGroup aria-label="Basic example" className={styles.qtyBtn}>
                                    <Button variant="secondary" className={styles.minusBtn} onClick={decreaseQuantity}><BiMinus /></Button>
                                    <Button variant="secondary" className={styles.numBtn} disabled value={JSON.stringify(quantity)}>{quantity}</Button>
                                    <Button variant="secondary" className={styles.plusBtn} onClick={increaseQuantity}><BiPlus /></Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <ButtonToolbar className={styles.btnPair}>
                            <Button onClick={handleAddToCart} className={styles.aTCBtn}>Add to cart <CiShoppingCart/></Button>
                            <Button className={styles.aTCBtn} onClick={addToWishlist}><CiHeart/></Button>
                        </ButtonToolbar>
                        <Offcanvas show={show} onHide={handleClose} placement='end' className={styles.miniCart}>
                            <Offcanvas.Header closeButton>
                            <Offcanvas.Title className={styles.miniCartTitle}>Current Cart</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className={styles.miniCartOrders}>
                                {
                                    cart.map(cartItem => (
                                        <Row className={styles.cartOrder}>
                                            <Col>
                                                <Card.Img variant="top" src={require(`../../../../Images/${cartItem.product.imageName}`)} className={styles.cardImage}/>
                                            </Col>
                                            <Col>
                                            <h1 className={styles.miniCartOrderTitle}>{cartItem.product.productName}</h1>
                                            <h1 className={styles.miniCartOrderQty}>
                                                <Row>
                                                    <Col><p>{cartItem.product.price}</p></Col>
                                                </Row>
                                            </h1>
                                            </Col>
                                            <Col>
                                                <div>
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
                                }
                                <div className="mt-auto d-flex flex-column justify-content-center">
                                    <Row className={styles.miniCartTotal}>
                                        <Col>
                                            <p className={styles.miniCartOrderTotalText}>Total:</p>
                                        </Col>
                                        <Col>
                                        <p className={styles.miniCartOrderTotalText}>£ {total}</p>
                                        </Col>
                                    </Row>
                                    <Button href='/cart' className={styles.miniCartBtn}><p className={styles.miniCartBtnText}>CART</p></Button>
                                </div>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>
                </Row>
            </Container>
            <Container className={styles.relatedDrops}>
                <h2 className={styles.bgText}>Related Drops</h2>                        
                <Row xs={2} sm={2} md={3} lg={5} className="d-flex justify-content-center g-6">
                    {
                        categoryProducts.slice(0, 4).map(categoryProduct => (
                            <Col className='d-flex justify-content-center' key={product._id}>
                                <CategoryProductCard categoryProduct={categoryProduct}/>
                            </Col>
                        ))
                    }
                </Row>
            </Container>
        </Container>
    </>
  )
}
