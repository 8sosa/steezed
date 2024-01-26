import React, { useEffect, useState, useContext} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { AccordionContext, Button, Tabs, Col, Container, Nav, Row, Tab, useAccordionButton, Offcanvas} from 'react-bootstrap'
import styles from './index.module.css'
import { CiSearch } from 'react-icons/ci'
import { CgMenuRightAlt } from "react-icons/cg";
import Product from '../Product'
import checkLogin from './auth';


function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;
  return (
    <button
      type="button"
      className={isCurrentEventKey ? styles.accordionBtnOpen : styles.accordionBtnClosed}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

export default function Profile() {
    const [activeTab, setActiveTab] = useState('first');
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const navigate = useNavigate();
    const [shopper, setShopper] = useState({});
    const {_id} = useParams();
    const uniqueStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];



    const handleTabSelect = (selectedTab) => {
        setActiveTab(selectedTab);
    }
    const getWishlist = async (token) => {
        try {
            const res = await axios.get('/wishlist', {
                headers: { Authorization: token}
            })
            setWishlist(res.data.products)
        } catch (error) {
            console.log(error)
        }
    }
    const getShopper = async (token) => {
        try {
            const res = await axios.get(`/shopper/${_id}`, {
                headers: {Authorization: token}
            })
            setShopper(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const deleteShopper = async () => {
        try {
            const token = localStorage.getItem('tokenStore')
            const res = await axios.delete(`/shopper/${_id}`, {
                headers: {Authorization: token}
            })
            console.log(res.data)
            navigate(`/login`)
        } catch (error) {
            console.log(error)
        }
    }
    const getOrders = async (token) => {
        try {
            const res = await axios.get(`/order`, {
                headers: {Authorization: token}
            })
            setOrders(res.data)
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
                    getShopper(token)
                    getOrders(token)
                    getWishlist(token)
                } 
            } else {
                navigate('/login')
            }
        }

        fetchData();
    }, [shopper])
      
  return (
    <>
      <Container className={styles.page}>
        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
            <Row sm={2} md={2} lg={2} className={styles.advHome}>
                <Col md={3} lg={2}>
                <section className={styles.sidebar}>
                    <Button className={styles.searchBtn}><CiSearch className={styles.searchIcon}/>Search</Button>
                    <Nav className={styles.dColumn}>
                        <Nav.Item>
                            <Nav.Link className={styles.navLin} eventKey="first"><ContextAwareToggle>Bio Data</ContextAwareToggle></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link className={styles.navLin} eventKey="second"><ContextAwareToggle>Your Orders</ContextAwareToggle></Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link className={styles.navLin} eventKey="third"><ContextAwareToggle>Wishlist</ContextAwareToggle></Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Button onClick={deleteShopper} className={styles.someButton}>Delete Account</Button>
                </section>
                </Col>
                <Col md={7} lg={8} className={styles.advContent}>
                <section className={styles.content}>
                    <Offcanvas show={show} onHide={handleClose} placement='end' className={styles.offcanvasStyle}>
                        <Offcanvas.Header closeButton>
                        </Offcanvas.Header>
                        <Offcanvas.Body className={styles.billingDetails}>
                            <Button className={styles.searchBtn}><CiSearch className={styles.searchIcon}/>Search</Button>
                            <Nav className={styles.dColumn}>
                                <Nav.Item>
                                    <Nav.Link className={styles.navLin} eventKey="first"><ContextAwareToggle>Bio Data</ContextAwareToggle></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link className={styles.navLin} eventKey="second"><ContextAwareToggle>Your Orders</ContextAwareToggle></Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                <Nav.Link className={styles.navLin} eventKey="third"><ContextAwareToggle>Wishlist</ContextAwareToggle></Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Button onClick={deleteShopper} className={styles.someButton}>Delete Account</Button>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <div className={styles.contentPane}>
                            <div className={styles.paneTitleBlock}>
                                <h1 className={styles.paneTitle}>Bio Data</h1>
                                <Button onClick={handleShow} className={styles.filter}><CgMenuRightAlt/></Button>
                            </div>
                            <label className={styles.fieldLabel}>First Name</label>
                            <h1 className={styles.textbox}>{shopper.firstName}</h1>
                            <label className={styles.fieldLabel}>Last Name</label>
                            <h1 className={styles.textbox}>{shopper.lastName}</h1>
                            <label className={styles.fieldLabel}>Username</label>
                            <h1 className={styles.textbox}>{shopper.userName}</h1>
                            <label className={styles.fieldLabel}>Phone Number</label>
                            <h1 className={styles.textbox}>{shopper.phoneNumber}</h1>
                            <label className={styles.fieldLabel}>Email address</label>
                            <h1 className={styles.textbox}>{shopper.email}</h1>
                            <label className={styles.fieldLabel}>Address</label>
                            <h1 className={styles.textbox}>{shopper.address}</h1>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                        <div className={styles.contentPane}>
                            <div className={styles.paneTitleBlock}>
                                <h1 className={styles.paneTitle}>Orders</h1>
                                <Button onClick={handleShow} className={styles.filter}><CgMenuRightAlt/></Button>
                            </div>
                            <div className={styles.profileOrders}>
                                <Tabs defaultActiveKey="All" id="uncontrolled-tab-example" className="mb-3">
                                <Tab eventKey="All" title={<h1 className={styles.tabTitle}>All</h1>} className={styles.profileOrders}>
                                    {orders.length === 0 ? (
                                        <p className={styles.fieldLabel}>No orders available.</p>
                                    ) : (
                                        orders.map((orderItem) => (
                                            <Row key={orderItem._id} className={styles.profileOrder}>
                                                <Col className='d-flex flex-column align-items-flex-start'>
                                                    <p className={styles.profileOrderText}>Order Number :</p>
                                                    <p className={styles.profileOrderText}>Order Total :</p>
                                                    <p className={styles.profileOrderText}>Order Status :</p>
                                                </Col>
                                                <Col className='d-flex flex-column align-items-flex-end'>
                                                    <p className={styles.profileOrderText2}>{orderItem._id.slice(-5)}</p>
                                                    <p className={styles.profileOrderText2}>£ {orderItem.totalPrice}</p>
                                                    <p className={styles.profileOrderText2}>{orderItem.status}</p>
                                                </Col>
                                            </Row>
                                        ))
                                    )}
                                </Tab>
                                {
                                    uniqueStatuses.map(status => (
                                        <Tab eventKey={status} title={<h1 className={styles.tabTitle}>{status}</h1>} className={styles.profileOrders}>
                                            {orders.length === 0 ? (
                                                <p className={styles.fieldLabel}>No {status} orders available.</p>
                                            ) : (
                                                    orders.filter(orderItem => orderItem.status === status).map(filteredOrder => (
                                                    <Row className={styles.profileOrder} key={filteredOrder._id}>
                                                        <Col className='d-flex flex-column align-items-flex-start'>
                                                            <p className={styles.profileOrderText}>Order Number :</p>
                                                            <p className={styles.profileOrderText}>Order Total :</p>
                                                            <p className={styles.profileOrderText}>Order Status :</p>
                                                        </Col>
                                                        <Col className='d-flex flex-column align-items-flex-end'>
                                                        <p className={styles.profileOrderText2}>{filteredOrder._id.slice(-5)}</p>
                                                        <p className={styles.profileOrderText2}>£ {filteredOrder.totalPrice}</p>
                                                        <p className={styles.profileOrderText2}>{filteredOrder.status}</p>
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}
                                        </Tab>
                                    ))
                                }
                                </Tabs>
                            </div>
                            
                        </div>
                    
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                        <div className={styles.contentPane}>
                            <div className={styles.paneTitleBlock}>
                                <h1 className={styles.paneTitle}>Wishlist</h1>
                                <Button onClick={handleShow} className={styles.filter}><CgMenuRightAlt/></Button>
                            </div>
                            <Row xs={2} sm={2} md={3} lg={4}>
                                {wishlist.length === 0 ? (
                                    <p className={styles.fieldLabel}>You wish for nothing Adventurer.</p>
                                ) : (
                                    wishlist.map(wishlistItem => (
                                        <Col className='d-flex justify-content-center'>
                                            <Product product={wishlistItem.product} />
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>
                        
                    </Tab.Pane>
                    </Tab.Content>
                </section>
                </Col>
            </Row>
        </Tab.Container>       
      </Container>
    </>
  )
}