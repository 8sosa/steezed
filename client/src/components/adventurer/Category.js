import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom'
import { Container, Row, Col, Button, Dropdown, Offcanvas } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.css';
import Product from '../Product';
import { HiMenuAlt2 } from "react-icons/hi";


export default function Category(){
    const Sidebar = () => {
        const navigate = useNavigate();
        const [categories, setCategories] = useState([]);
        const [sellers, setSellers] = useState([]);

        const getCategories = async (token) =>{
            const res = await axios.get('/category')
            setCategories(res.data)
        }

        const getSellers = async (token) => {
            const res = await axios.get('/seller')
            setSellers(res.data)
        }
        const handleCategoryChange = (categoryId) => {
            // Update the URL and trigger a re-render with the new product ID
            navigate(`/category/${categoryId}/products`);
        };
        const handleSellerChange = (sellerId) => {
            // Update the URL and trigger a re-render with the new product ID
            navigate(`/seller/${sellerId}`);
        };

        useEffect(() =>{
            getCategories()
            getSellers()
        }, [])

        return (
          <Container className={styles.CategorySidebar}>
            {<section className={styles.CategoryLoots}>
                            <div className="ms-2 me-auto">
                                <ul className="list-unstyled">
                                    <li className={styles.listHeader}>Categories</li>
                                    {
                                        categories.map(category => (
                                            <li>
                                                <Button className={styles.listItem} onClick={() => handleCategoryChange(category._id)}>
                                                   {category.name}
                                                </Button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div className="ms-2 me-auto">
                                <ul className="list-unstyled">
                                    <li className={styles.listHeader}>Shops</li>
                                    {
                                        sellers.map(seller => (
                                            <li>
                                                <Button className={styles.listItem} onClick={() => handleSellerChange(seller._id)}>
                                                    {seller.shopName}
                                                </Button>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            {/* <div className='ms-2 me-auto'>
                            <Form type="radio" name="options" defaultValue={1}>
                                <ul className="list-unstyled">
                                    <li className={styles.listHeader}>Price</li>
                                    <li className={styles.listItem}>
                                    <Form.Check
                                        type={'radio'}
                                        label="Under #10,000"
                                        value={1}
                                    />
                                    </li>
                                    <li className={styles.listItem}>
                                    <Form.Check
                                        type={'radio'}
                                        label="#10,000 - #50,000"
                                        value={2}
                                    />
                                    </li>
                                    <li className={styles.listItem}>
                                    <Form.Check
                                        type={'radio'}
                                        label="#50,000 - #100,000"
                                        value={3}
                                    />
                                    </li>
                                    <li className={styles.listItem}>
                                    <Form.Check
                                        type={'radio'}
                                        label="#100,000 - #500,000"
                                        value={4}
                                    />
                                    </li>
                                    <li className='listItem'>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                            type="number"
                                            placeholder="Min"
                                            className={styles.priceRange}
                                            inputMode="numeric"
                                            // value={minValue}
                                            // onChange={(e) => setMinValue(e.target.value)}
                                            />
                                            
                                            <Form.Control
                                            type="number"
                                            placeholder="Max"
                                            className={styles.priceRange}
                                            inputMode="numeric"
                                            // value={maxValue}
                                            // onChange={(e) => setMaxValue(e.target.value)}
                                            />
                                            <Button variant="primary" 
                                            className={styles.priceCheckBtn}
                                            // onClick={handleCheckClick}
                                            >
                                            Check
                                            </Button>
                                        </InputGroup>
                                    </li>
                                </ul>
                            </Form>
                            </div> */}
                </section>}
          </Container>
        );
    };
      
    const Content = () => {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const params = useParams();
        const category_id = params.id;
        const [products, setProducts] = useState([]);
        const [categoryName, setCategoryName] = useState('');

        const getCategoryProducts = async () => {
            try {
                const res = await axios.get(`/category/${category_id}/products`);
                setProducts(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        const getCategoryName = async () => {
            try {
                const res = await axios.get(`/category/${category_id}`);
                setCategoryName(res.data.name);
            } catch (error) {
                console.log(error);
            }
        };

        useEffect(() =>{
            getCategoryProducts()
            getCategoryName()
        }, [category_id])
    
        return (
          <Container className={styles.CategoryContent}>
            {<section className={styles.CategoryLoots}>
                <h2 className={styles.sideTitle}>{categoryName}</h2>
                <Row className={styles.top}>
                    <Col className={styles.miniSidebar}>
                        <Button onClick={handleShow} className={styles.filter2}><HiMenuAlt2 /></Button>
                        <Offcanvas show={show} onHide={handleClose} placement='start'>
                            <Offcanvas.Header closeButton>
                            </Offcanvas.Header>
                            <Offcanvas.Body className={styles.billingDetails}>
                                <Sidebar />
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Col>
                    <Col className='d-flex align-items-center justify-content-end'>
                        <p className={styles.smText}>Sort by</p>  
                        <Dropdown>
                            <Dropdown.Toggle className={styles.filter} id="dropdown-basic">
                                Ratings
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Price: High - Low</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Name</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Price: Low - High</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                        
                </Row>
                <Row xs={2} sm={2} md={4} lg={4} className="d-flex justify-content-center g-6">
                    {
                        products.map(product => (
                            <Col className={styles.categoryCol}>     
                                <Product product={product}/>
                            </Col>
                        ))
                    }
                </Row>
            </section>}
          </Container>
        );
    };
    return (
        <>
            <Container className={styles.Category}>
                    <Col xs={4} className={styles.sidebarPane}><Sidebar /></Col>
                    <Col xs={8} className={styles.mainPane}><Content /></Col>
            </Container>
        </>
    )
}