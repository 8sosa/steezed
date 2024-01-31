import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom'
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.css';
import Product from '../CategoryProductCard';
import { CgMenuRightAlt } from "react-icons/cg";

export default function Shop(){
    const Sidebar = () => {
        const [loading, setLoading] = useState(true);
        const navigate = useNavigate();
        const [categories, setCategories] = useState([]);
        const [sellers, setSellers] = useState([]);

        const getCategories = async (token) =>{
            setLoading(true);
            const res = await axios.get('/category')
            setCategories(res.data)
            setLoading(false); // Set loading state to false
              
        }

        const getSellers = async (token) => {
            setLoading(true);
            const res = await axios.get('/seller')
            setSellers(res.data)
            setLoading(false); // Set loading state to false
        }

        const handleCategoryChange = (categoryId) => {
            // Update the URL and trigger a re-render with the new product ID
            navigate(`/c/category/${categoryId}/products`);
        };
        const handleSellerChange = (sellerId) => {
            // Update the URL and trigger a re-render with the new product ID
            navigate(`/shop/${sellerId}`);
        };

        useEffect(() =>{
            getCategories()
            getSellers()
        }, [])

        if (loading === true) {
            return (
                <>
                    <div>
                        <h1>loading</h1>
                    </div>
                </>
            )
        }

        return (
            <Container className={styles.CategorySidebar}>
                <section className={styles.CategoryLoots}>
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
                </section>
            </Container>
        );
      };
      
      const Content = () => {
        const [show, setShow] = useState(false);
        const [loading, setLoading] = useState(true);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const {_id} = useParams();
        const [products, setProducts] = useState([])
        const [seller, setSeller] = useState({})


        const getProductsBySeller = async (token, page = 1, itemsPerPage = 10) => {
            setLoading(true);
            try {
              const res = await axios.get(`/seller/${_id}/products`, {
                headers: {Authorization: token},
                params: { page, itemsPerPage }
              })
              setProducts(res.data)
              console.log(res.data)
            } catch (error) {
              console.error('Error fetching product data:', error);
            }
            setLoading(false);
        };

          const getSeller = async (token) => {
            setLoading(true);
            try {
                const res = await axios.get(`/seller/${_id}`, {
                  headers: {Authorization: token}
                })
                setSeller(res.data)
            } catch (error) {
              console.log(error)
            }
            setLoading(false);
          };

        useEffect(() =>{
            getProductsBySeller()
            getSeller()
        }, [])

        if (loading === true) {
            return (
                <>
                    <div>
                        <h1>loading</h1>
                    </div>
                </>
            )
        }
    
        return (
          <Container className={styles.CategoryContent}>
            { <section className={styles.CategoryLoots}>
                <div className={styles.miniSidebar}>
                    <h2 className={styles.sideTitle}>{seller.shopName}</h2>
                    <Button onClick={handleShow} className={styles.filter2}><CgMenuRightAlt /></Button>
                </div>
                <Offcanvas show={show} onHide={handleClose} placement='end' className={styles.Offcanvas}>
                    <Offcanvas.Header closeButton className={styles.Offcanvas}>
                    </Offcanvas.Header>
                    <Offcanvas.Body className={styles.Offcanvas}>
                        <Sidebar/>
                    </Offcanvas.Body>
                </Offcanvas>
                <Row className="d-flex justify-content-center p-3">
                    {
                        products.map(relatedProduct => (
                            <Col className={styles.categoryCol}>
                                <Product relatedProduct={relatedProduct} />
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