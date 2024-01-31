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
    const [categoryName, setCategoryName] = useState('');
    const [accessToken, setAccessToken] = useState("");
    const {_id} = useParams();
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const [wishlist, setWishlist] = useState([])
    const [relatedProducts, setRelatedProducts] = useState([]);
    const excludedProductId = _id; 

   
    const getProductById = async () =>{
        try {
            if (_id) {
                const res = await axios.get(`/api/products/${_id}`)
                setProduct(res.data)
                getRelatedProducts(res.data.category)
                const result = await axios.get(`/category/${res.data.category}`);
                setCategoryName(result.data.name);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };
    const getRelatedProducts = async (category_id) => {
        try {
            const res = await axios.get(`/category/${category_id}/products`);
            setRelatedProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };
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
    const handleRelatedProductClick = (productId) => {
        // Update the URL and trigger a re-render with the new product ID
        navigate(`/p/api/products/${productId}`);
    };
    const handleCategoryChange = (categoryId) => {
        // Update the URL and trigger a re-render with the new product ID
        navigate(`/c/category/${categoryId}/products`);
    };
    
    useEffect(() => {
        const token = localStorage.getItem('tokenStore')
        if (token) {
            setAccessToken(token)
            getCart(token)
        } 
    }, [_id, cart])
    
    useEffect(() => {
        getProductById()
        if (_id) {
            getRelatedProducts(_id);
        }
      }, [_id]);
    
  return (
    <>
        <Container className={styles.homePage}>
            <section className={styles.itemDetails}>
                <Row className={styles.itemRow}>
                    <Col sm={5} md={5} xl={7}>
                        <div className={styles.itemCard}>
                            {product.imageName && (
                                <img src={require(`../../../../Images/${product.imageName}`)} alt='product' className={styles.itemImg}/>
                            )}                        
                        <Button className={styles.listBtn} onClick={() => handleCategoryChange(product.category)}>
                            {categoryName}
                        </Button>     
                        </div>
                    </Col>
                    <Col sm={7} md={7} xl={5} className='p-5'>
                        <div className={styles.itemdeets}>
                            <h1 className={styles.itemTitle} title={product.productName}>{product.productName}</h1>
                            <p className={styles.itemDescription}>{product.description}</p>
                                               
                            <p className={styles.itemDescription}><span className={styles.itemAtt}>Price: </span> # {product.price}</p>
                            <p className={styles.itemDescription}><span className={styles.itemAtt}>Limited Availability: </span> {product.quantity} pieces in stock.</p>
                            <div className={styles.itemQty}>
                                <p className={styles.itemAtt}>Qty:</p>                               
                                <ButtonGroup aria-label="Basic example" className={styles.qtyBtn}>
                                    <Button variant="secondary" className={styles.minusBtn} onClick={decreaseQuantity}><BiMinus /></Button>
                                    <Button variant="secondary" className={styles.numBtn} disabled value={JSON.stringify(quantity)}>{quantity}</Button>
                                    <Button variant="secondary" className={styles.plusBtn} onClick={increaseQuantity}><BiPlus /></Button>
                                </ButtonGroup>                  
                            </div>
                            <ButtonToolbar className={styles.btnPair}>
                                <Button className={styles.aTCBtn} onClick={addToWishlist}><CiHeart/></Button>
                                <Button onClick={handleAddToCart} className={styles.aTCBtn}>Add to cart <CiShoppingCart/></Button>
                            </ButtonToolbar>
                        </div>
                    </Col>
                        <Offcanvas show={show} onHide={handleClose} placement='end' className={styles.miniCart}>
                            <Offcanvas.Header closeButton>
                            <Offcanvas.Title className={styles.miniCartTitle}>Current Cart</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className={styles.miniCartOrders}>
                                <div>
                                    {
                                        cart.map(cartItem => (
                                            <Row className={styles.miniCartOrder} key={'c'+cartItem.product._id}>
                                                <Col xs={4} xl={6} className={styles.height}>
                                                    <Card.Img src={require(`../../../../Images/${cartItem.product.imageName}`)} className={styles.miniCartOrderImage}/>
                                                    <h1 className={styles.miniCartOrderTitle}>{cartItem.product.productName}</h1>
                                                    <h1 className={styles.miniCartOrderTitle}># {cartItem.product.price}</h1>
                                                </Col>
                                                <Col xs={8} xl={6} className={styles.height}>
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
                                    }
                                </div>
                                    <div className={styles.miniCartTotal}>
                                        <p className={styles.miniCartOrderTotalText}>Total: # {total}</p>
                                        <Button href='/c/cart' className={styles.miniCartBtn}><p className={styles.miniCartBtnText}>Go To Cart</p></Button>
                                    </div>
                            </Offcanvas.Body>
                        </Offcanvas>
                </Row>
            </section>
            <section className={styles.relatedDrops}>
                <h2 className={styles.bgText}>Related Drops</h2>                        
                <Row xs={2} sm={2} md={3} lg={5} className="d-flex justify-content-center g-6">
                    {
                        relatedProducts.filter(relatedProduct => relatedProduct._id !== excludedProductId).slice(0, 4).map(relatedProduct => (
                            <Col className={styles.categoryCol} key={'rp'+product._id} onClick={() => handleRelatedProductClick(relatedProduct._id)}>
                                <CategoryProductCard relatedProduct={relatedProduct}/>
                            </Col>
                        ))
                    }
                </Row>
            </section>
        </Container>
    </>
  )
}
