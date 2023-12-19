import React, { useEffect, useState, useContext} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, AccordionContext, Button, Tabs, Card, Col, Container, Nav, Row, Tab, useAccordionButton, Offcanvas} from 'react-bootstrap'
import styles from './index.module.css'
import { CiSearch } from 'react-icons/ci'
import loot from '../images/bigloot.png'
import { BiMenu } from 'react-icons/bi'
import { AiOutlineUserDelete } from "react-icons/ai";


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
    const navigate = useNavigate()
    const [shopper, setShopper] = useState({})
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
    const deleteShopper = async (token) => {
        try {
            const res = await axios.delete(`/shopper/${_id}`, {
                headers: {Authorization: token}
            })
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    const updateShopper = async (e) => {
        e.preventDefault(); 
        try {
            const form = document.forms.namedItem("adventurer");
            const formData = new FormData(form)
            const token = localStorage.getItem('tokenStore');
            const res = await axios.put(`/shopper/${_id}`, formData, {
                headers: {Authorization: token}
            })
            console.log(formData)
            setShopper(res.data)
            
        } catch (error) {
            console.log(error)
        }
    }
    // const UpdateShopper = async (e, shopperId) => {
    //     try {
    //       e.preventDefault();
    //       const form = document.forms.namedItem("adventurer");
    //       const formData = new FormData(form);
      
    //       // Make a PUT request to update the shopper
    //       const res = await axios.put(`/shopper/${shopperId}/update`, formData);
      
    //       console.log(res);
    //       navigate('/');
    //     } catch (error) {
    //       console.error(error);
    //       // Handle error appropriately, e.g., show a user-friendly message
    //     }
    //   };
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
        const token = localStorage.getItem('tokenStore')
        if (token) {
            getShopper(token)
            getOrders(token)
            getWishlist(token)
        } else {
            navigate('/login')
        }
    }, [])
      
  return (
    <>
      <Container className={styles.page}>
        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect} className={styles.profilePageContainer}>
            <Row className={styles.profilePageRow}>
                <Col xs={3}>
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
                    <Button onClick={deleteShopper}>Delete Account <AiOutlineUserDelete size={25} /></Button>
                </section>
                </Col>
                <Col xs={8} className={styles.mainPane}>
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
                                <Nav.Item>
                                <Nav.Link className={styles.navLin} eventKey="fourth"><ContextAwareToggle>Billing & Shipping</ContextAwareToggle></Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>
                    <Tab.Content>
                        <div className={styles.miniSidebar}>
                            <Button onClick={handleShow} className={styles.menu}><BiMenu /></Button>
                        </div>
                    <Tab.Pane eventKey="first">
                            <h1 className={styles.accountDetailsHeader}>Account Details</h1>
                            <Form onSubmit={(e) => updateShopper(e, updateShopper)} name='adventurer'>
                                {/* <Row className='d-flex align-items-flex-start mb-5'> */}
                                    {/* <Col xs={5}>
                                        <Form.Group className={styles.profilePictureBox}>
                                            <Form.Label className={styles.billingDetailsLabel}>Profile Picture</Form.Label>
                                            <img src={require(`../../../../Avatar/${shopper.imageName}`)} alt='profile' className={styles.profilePicture}/>
                                        </Form.Group>
                                    </Col> */}
                                    {/* <Col xs={7}> */}
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label className={styles.billingDetailsLabel}>First Name</Form.Label>
                                            <Form.Control className={styles.formField} type="text" name='firstName' placeholder={shopper.firstName} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label className={styles.billingDetailsLabel}>Last Name</Form.Label>
                                            <Form.Control className={styles.formField} type="text" name='lastName' placeholder={shopper.lastName} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label className={styles.billingDetailsLabel}>Username</Form.Label>
                                            <Form.Control className={styles.formField} name='userName' type="text" placeholder={shopper.userName} />
                                        </Form.Group>
                                    {/* </Col>
                                </Row> */}
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className={styles.billingDetailsLabel}>Address</Form.Label>
                                    <Form.Control className={styles.formField} type="text" name='address' placeholder={shopper.address} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className={styles.billingDetailsLabel}>Email address</Form.Label>
                                    <Form.Control className={styles.formField} type="email" name='email' placeholder={shopper.email} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className={styles.billingDetailsLabel}>Phone Number</Form.Label>
                                    <Form.Control className={styles.formField} type="tel" name='phoneNumber' placeholder={shopper.phoneNumber} />
                                </Form.Group>
                                <div className='d-flex justify-content-center'>
                                    <Button className={styles.accountDetailsBtn} type="submit">Update</Button>
                                </div>
                            </Form>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                    <Tabs
                        defaultActiveKey="All"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        >
                        <Tab eventKey="All" title="All">
                            {
                                orders.map((orderItem) => (
                                    <Row key={orderItem._id} className={styles.profileOrder}>
                                        <Col>
                                            <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                                        </Col>
                                        <Col>
                                            <p className={styles.profileOrderText}>Order Number :</p>
                                            <p className={styles.profileOrderText}>Order Total :</p>
                                            <p className={styles.profileOrderText}>Order Status :</p>
                                        </Col>
                                        <Col>
                                            <p className={styles.profileOrderText}>{orderItem._id.slice(-5)}</p>
                                            <p className={styles.profileOrderText}>£ {orderItem.totalPrice}</p>
                                            <p className={styles.profileOrderText}>{orderItem.status}</p>
                                        </Col>
                                    </Row>
                                ))
                            }
                        </Tab>
                        {
                            uniqueStatuses.map(status => (
                                <Tab eventKey={status} title={status}>
                                    {
                                        orders.filter(orderItem => orderItem.status === status).map(filteredOrder => (
                                            <Row className={styles.profileOrder} key={filteredOrder._id}>
                                                <Col>
                                                <img src={loot} alt='purple pineapple' className={styles.miniCheckoutOrderPic}/>
                                                </Col>
                                                <Col>
                                                <p className={styles.profileOrderText}>Order Number :</p>
                                                <p className={styles.profileOrderText}>Order Total :</p>
                                                <p className={styles.profileOrderText}>Order Status :</p>
                                                </Col>
                                                <Col>
                                                <p className={styles.profileOrderText}>{filteredOrder._id.slice(-5)}</p>
                                                <p className={styles.profileOrderText}>£ {filteredOrder.totalPrice}</p>
                                                <p className={styles.profileOrderText}>{filteredOrder.status}</p>
                                                </Col>
                                            </Row>
                                        ))
                                    }
                                </Tab>
                            ))
                        }
                        {/* <Tab eventKey="Processing" title="Processing">
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        </Tab>
                        <Tab eventKey="Shipped" title="Shipped">
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        </Tab>
                        <Tab eventKey="Delivered" title="Delivered">
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        </Tab>
                        <Tab eventKey="Canceled" title="Canceled">
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        <Row className={styles.profileOrder}>
                            <Col>
                                <img src={loot} alt='purple pineapple'className={styles.miniCheckoutOrderPic}/>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>Order Number :</p>
                                <p className={styles.profileOrderText}>Order Total :</p>
                                <p className={styles.profileOrderText}>Order Status :</p>
                            </Col>
                            <Col>
                                <p className={styles.profileOrderText}>NH78Uj1</p>
                                <p className={styles.profileOrderText}>£ 1907.73</p>
                                <p className={styles.profileOrderText}>Processing</p>
                            </Col>
                        </Row>
                        </Tab> */}
                    </Tabs>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                        <Row sm={1} md={2} lg={3} xl={4}>
                            {
                                wishlist.map(wishlistItem => (
                                    <Col className='d-flex justify-content-center'>
                                        <Card className={styles.reviewCard}>
                                        <Card.Img variant="top" src={require(`../../../../Images/${wishlistItem.product.imageName}`)} className={styles.cardImage}/>
                                        <Card.Body className={styles.reviewCardBody}>
                                            <h1 className={styles.reviewCardTitle}>{wishlistItem.product.productName}</h1>
                                            <h1 className={styles.reviewCardText}>{wishlistItem.product.description}</h1>
                                        </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Row>
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