import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {useParams, Link} from 'react-router-dom'
import { Container, Row, Col, Button, Dropdown, InputGroup, Form, Offcanvas } from 'react-bootstrap'
import { GoStar, GoStarFill } from 'react-icons/go';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.css';
import Product from '../CategoryProductCard';


export default function Shop(){
    const Sidebar = () => {
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
                                    <li  className={styles.listItem}><Link to={{ pathname: `/category/${category._id}/products` }} className={styles.link}>{category.name}</Link></li>
                                  ))
                                }
                                </ul>
                            </div>
                            <div className="ms-2 me-auto">
                                <ul className="list-unstyled">
                                    <li className={styles.listHeader}>Rating</li>
                                    <li className={styles.listItem}>
                                        <Row className={styles.sidebarRating}>
                                            <div className={styles.starContainer}>
                                                <GoStarFill />
                                                <GoStarFill />
                                                <GoStarFill />
                                                <GoStarFill />
                                                <GoStar />
                                            </div>
                                        </Row>
                                    </li>
                                    <li className={styles.listItem}>
                                        <Row className={styles.sidebarRating}>
                                            <div className={styles.starContainer}>
                                                <GoStarFill />
                                                <GoStarFill />
                                                <GoStarFill />
                                                <GoStar />
                                                <GoStar />
                                            </div>
                                        </Row>
                                    </li>
                                    <li className={styles.listItem}>
                                        <Row className={styles.sidebarRating}>
                                            <div className={styles.starContainer}>
                                                <GoStarFill />
                                                <GoStarFill />
                                                <GoStar />
                                                <GoStar />
                                                <GoStar />
                                            </div>
                                        </Row>
                                    </li>
                                    <li className={styles.listItem}>
                                        <Row className={styles.sidebarRating}>
                                            <div className={styles.starContainer}>
                                                <GoStarFill />
                                                <GoStar />
                                                <GoStar />
                                                <GoStar />
                                                <GoStar />
                                            </div>
                                        </Row>
                                    </li>
                                </ul>
                            </div>
                            <div className="ms-2 me-auto">
                                <ul className="list-unstyled">
                                    <li className={styles.listHeader}>Shops</li>
                                    {
                                        sellers.map(seller => (
                                            <li  className={styles.listItem}><Link to={{ pathname: `/seller/${seller._id}` }} className={styles.link}>{seller.shopName}</Link></li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div className='ms-2 me-auto'>
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
                            </div>
                </section>}
          </Container>
        );
      };
      
      const Content = () => {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const {_id} = useParams();
        const [products, setProducts] = useState([])
        const [seller, setSeller] = useState({})


        const getProductsBySeller = async (token) => {
            try {
              const res = await axios.get(`/seller/${_id}/products`, {
                headers: {Authorization: token}
              })
              setProducts(res.data)
              console.log(res.data)
            } catch (error) {
              console.error('Error fetching product data:', error);
            }
          };
          const getSeller = async (token) => {
            try {
                const res = await axios.get(`/seller/${_id}`, {
                  headers: {Authorization: token}
                })
                setSeller(res.data)
            } catch (error) {
              console.log(error)
            }
          };

        useEffect(() =>{
            getProductsBySeller()
            getSeller()
        }, [])
    
        return (
          <Container className={styles.CategoryContent}>
            { <section className={styles.CategoryLoots}>
                <h2 className={styles.sideTitle}>{seller.shopName}</h2>
                <Row className={styles.top}>
                    <Col className='d-flex justify-content-start'>
                        <div className={styles.filter1}>16 of 174 Loots</div>                                                    
                    </Col>
                    <Col className={styles.miniSidebar}>
                        <Button onClick={handleShow} className={styles.filter}>PAY</Button>
                        <Offcanvas show={show} onHide={handleClose} placement='end'>
                            <Offcanvas.Header closeButton>
                            </Offcanvas.Header>
                            <Offcanvas.Body className={styles.billingDetails}>
                                <Sidebar/>
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
                <Row sm={2} className="d-flex justify-content-center g-6">
                    {
                        products.map(product => (
                        <Col className='d-flex justify-content-center'>
                            <Product product={product} />
                        </Col>
                        ))
                    }
                </Row>
                {/* <Row className={styles.pagination}>
                    <Pagination >
                        <Pagination.First className={styles.paginationItem}/>
                        <Pagination.Prev className={styles.paginationItem}/>
                        <Pagination.Item className={styles.paginationItem} active>{1}</Pagination.Item>
                        <Pagination.Item className={styles.paginationItem}>{2}</Pagination.Item>
                        <Pagination.Ellipsis className={styles.paginationItem}/>
                        <Pagination.Item className={styles.paginationItem} >{19}</Pagination.Item>
                        <Pagination.Item className={styles.paginationItem}>{20}</Pagination.Item>
                        <Pagination.Next className={styles.paginationItem}/>
                        <Pagination.Last className={styles.paginationItem}/>
                    </Pagination>
                </Row> */}
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