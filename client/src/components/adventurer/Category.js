import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom'
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap'
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
            navigate(`/shop/${sellerId}`);
        };

        useEffect(() =>{
            getCategories()
            getSellers()
        }, [])

        return (
            <Container className={styles.CategorySidebar}>
                <section className={styles.CategoryLoots}>
                    <ul className="list-unstyled">
                        <li className={styles.listHeader}>Categories</li>
                        <div className="d-flex flex-column">
                            {
                                categories.map(category => (
                                    <li className='d-flex'>
                                        <Button className={styles.listBtn} onClick={() => handleCategoryChange(category._id)}>
                                            {category.name}
                                        </Button>
                                    </li>
                                ))
                            }
                        </div>
                    </ul>
                    <ul className="list-unstyled">
                        <li className={styles.listHeader}>Shops</li>
                            <div className="d-flex flex-column">
                            {
                                sellers.map(seller => (
                                    <li className='d-flex'>
                                        <Button className={styles.listBtn} onClick={() => handleSellerChange(seller._id)}>
                                            {seller.shopName}
                                        </Button>
                                    </li>
                                ))
                            }
                        </div>
                    </ul>
                </section>
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
            <div className={styles.miniSidebar}>
                <h2 className={styles.sideTitle}>{categoryName}</h2>
                <Button onClick={handleShow} className={styles.filter2}><HiMenuAlt2 /></Button>
            </div>
            <Offcanvas show={show} onHide={handleClose} placement='start' className={styles.Offcanvas}>
                <Offcanvas.Header closeButton className={styles.Offcanvas}>
                </Offcanvas.Header>
                <Offcanvas.Body className={styles.Offcanvas}>
                    <Sidebar />
                </Offcanvas.Body>
            </Offcanvas>
            <Row className="d-flex justify-content-center p-3">
                {
                    products.map(product => (
                        <Col className={styles.categoryCol}>     
                            <Product product={product}/>
                        </Col>
                    ))
                }
            </Row>
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