import React, { useEffect, useState, useContext} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import { Accordion, AccordionContext, Button, Card, Col, Container, Form, Image, Nav, Row, Tab, Tabs, useAccordionButton} from 'react-bootstrap'
import styles from './index.module.css'
import Backdrop from '../images/backdrop.png'
import Logo from '../images/essential.png'
import Loot from '../images/bigloot.png'
import { AiFillStar } from 'react-icons/ai'
import { AiOutlineStar } from 'react-icons/ai'
import { TbCash } from 'react-icons/tb'
import { PiUserFocusThin } from 'react-icons/pi'
import { FaClipboardList } from 'react-icons/fa'
import { GiMoneyStack } from 'react-icons/gi'
import { CiSearch } from 'react-icons/ci'
import Piechart from './PieChart'
import LineChart from './LineChart'
import RadarChart from './RadarChart'
import BarChart from './BarChart'
import HorChart from './HorizontalChart'


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



export default function Home(props) {

  const [activeTab, setActiveTab] = useState('shop');
  const uniqueStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const [tokenStore, setToken] = useState('');
  const handleTabSelect = (selectedTab) => { setActiveTab(selectedTab) };
  const [seller, setSeller] = useState({})
  const [products, setProducts] = useState([])
  const [product, setProduct] = useState({productName: '', image: '', description: '', price: '', quantity: '', category: ''})
  const {_id} = useParams();
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState()
  const [order, setOrder] = useState([]);
  // const [orderProduct, setOrderProduct] = useState([])


  const CreateProduct = async (e) => {
    e.preventDefault();
    const form = document.forms.namedItem("newLoot");
    const formData = new FormData(form)
    const res = await axios.post(`/api/products/image`, formData,{
      headers: {Authorization: tokenStore}
    })
    console.log(file)
    console.log(res)
  }

  const getCategories = async (token) =>{
    const res = await axios.get('/category', {
      headers:{Authorization: token}
    })
    setCategories(res.data)
  }
  
  const getSeller = async (token) => {
    try {
      const res = await axios.get(`/seller/${_id}`, {
        headers: {Authorization: token}
      })
      setSeller(res.data)
      setOrder(res.data.orders)
    } catch (error) {
      console.log(error)
    }
  }

  const getProductsBySeller = async (token) => {
    try {
      const res = await axios.get(`/seller/${_id}/products`, {
        headers: {Authorization: token}
      })
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }
  
  // const getProductById = async (productId) => {
  //   try {
  //     const res = await axios.get(`/api/products/${productId}`)
  //     setOrderProduct(res.data)
  //   } catch (error) {
  //     console.error('Error fetching product data:', error);
  //   }
  // }

  // order.forEach((orderItem) => {
  //     const productId = orderItem.product;
  //     getProductById(productId);
  //   });

  const ChangeInput = d => {
    const {name, value} = d.target;
    setProduct({...product, [name]:value})
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(orderId)
      const res = await axios.put(`/seller/${_id}/orders/${orderId}`, {
        newStatus: newStatus,
      });
      // Assuming your API returns the updated seller data
      const updatedSeller = res.data;
      
      // Handle the updated seller data as needed
      console.log('Updated Seller:', updatedSeller);
    } catch (error) {
      console.error('Error updating order status:', error);
      // Handle error, e.g., show a notification to the user
    }
  };

  const onChangeSelectInput = e => {
    const {name, value} = e.target;
    setProduct({...product, [name]:value})
  }
  
  useEffect(() => {
    // getProductById()
    const token = localStorage.getItem('tokenStore')
    if(token){
      setToken(token)
      getProductsBySeller(token)
      getSeller(token)
      getCategories(token)
    }
  }, [])
  
  return (
    <>
      <Container className={styles.page}>
        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
          <Row className={styles.merchantHome}>
              <Col xs={4} className='d-flex'>
              <section className={styles.sidebar}>
                <Button className={styles.searchBtn}><CiSearch className={styles.searchIcon} /> Search</Button>
              <Nav variant='underline'>
                <Nav.Item>
                    <Accordion flush>
                      <Nav.Link className={styles.navLin} disabled><li><ContextAwareToggle>Shop Manager</ContextAwareToggle></li></Nav.Link>
                        <Accordion.Collapse className={styles.listbox}>
                          <ul>
                            <li><Nav.Link className={styles.navLinItem} eventKey='shop'>Store Information</Nav.Link></li>
                          </ul>
                        </Accordion.Collapse>
                    </Accordion>
                </Nav.Item>
                <Nav.Item>
                  <Accordion>
                    <Nav.Link className={styles.navLin} disabled><li><ContextAwareToggle>Product Manager</ContextAwareToggle></li></Nav.Link>
                    <Accordion.Collapse className={styles.listbox}>
                      <ul>
                        <li><Nav.Link className={styles.navLinItem} eventKey='product1'>New Product</Nav.Link></li>
                        <li><Nav.Link className={styles.navLinItem} eventKey='product2'>Product listings</Nav.Link></li>
                        <li><Nav.Link className={styles.navLinItem} eventKey='product3'>Product Analytics</Nav.Link></li>
                      </ul>
                    </Accordion.Collapse>
                  </Accordion>
                </Nav.Item>
                <Nav.Item>
                    <Accordion>
                      <Nav.Link className={styles.navLin} disabled><li><ContextAwareToggle>Order Manager</ContextAwareToggle></li></Nav.Link>
                        <Accordion.Collapse className={styles.listbox}>
                          <ul>
                            <li><Nav.Link className={styles.navLinItem} eventKey='order1'>Orders</Nav.Link></li>
                            <li><Nav.Link className={styles.navLinItem} eventKey='order2'>Refunds & Returns</Nav.Link></li>
                          </ul>
                        </Accordion.Collapse>
                    </Accordion>
                </Nav.Item>
                <Nav.Item>
                    <Accordion>
                    <Nav.Link className={styles.navLin} disabled><li><ContextAwareToggle>Sale Manager</ContextAwareToggle></li></Nav.Link>
                        <Accordion.Collapse className={styles.listbox}>
                          <ul>
                            <li><Nav.Link className={styles.navLinItem} eventKey='sale1'>Sales Overview</Nav.Link></li>
                            <li><Nav.Link className={styles.navLinItem} eventKey='sale2'>Product Promotions</Nav.Link></li>
                            <li><Nav.Link className={styles.navLinItem} eventKey='sale3'>User Reviews</Nav.Link></li> 
                          </ul>
                        </Accordion.Collapse>
                    </Accordion>
                </Nav.Item>
              </Nav>
              </section>
              </Col>
              <Col xs={8}>
                <section className={styles.content}>
                  <Tab.Content>
                    <Tab.Pane eventKey='shop'>
                      <div className={styles.contentPane}>
                        <h1 className={styles.paneTitle}>Shop Details</h1>
                        <Form>
                              <Form.Group className={styles.imgSection}>
                                <Image src={Backdrop} fluid className={styles.backdrop}/>
                                <badge className={styles.logoBadge}><Image src={Logo} fluid className={styles.shopLogo}/></badge>
                              </Form.Group>
                            <div className={styles.pageSection}>
                              <Form.Group className={styles.fullbox}>
                                <Form.Label className={styles.fieldLabel}>Shop Name</Form.Label>
                                <Form.Control type="text" className={styles.textbox} placeholder={seller.shopName}/>
                              </Form.Group>
                              <Form.Group className={styles.fullbox}>
                                <Form.Label className={styles.fieldLabel}>Shop Description</Form.Label>
                                <Form.Control as="textarea" rows={3} className={styles.checkBox} placeholder="At Nature's Haven, we believe ..."/>
                              </Form.Group>
                            </div>
                          <Row xs={1} md={2} className='mb-5'>
                            <Col className={styles.fullbox}>
                              <Form.Label className={styles.fieldLabel}>Contact Details</Form.Label>
                              <Form.Group className={styles.checkBox}>
                                <Form.Label className={styles.textLabel}>Phone Number</Form.Label>
                                <Form.Control type="num" placeholder={seller.phoneNumber} className={styles.textbox}/>
                                <Form.Label className={styles.textLabel}>Email Address</Form.Label>
                                <Form.Control type="email" placeholder={seller.email} className={styles.textbox}/>
                                <Form.Label className={styles.textLabel}>Shop Address</Form.Label>
                                <Form.Control type="text" placeholder={seller.shopAddress} className={styles.textbox}/>
                              </Form.Group>
                            </Col>
                            <Col className={styles.fullbox}>
                              <Form.Label className={styles.fieldLabel}>Operating Hours</Form.Label>
                                <Form.Group className={styles.checkBox}>
                                  <Form.Label className={styles.textLabel}>Weekdays (Mon - Fri)</Form.Label>
                                  <Form.Control type="text" placeholder="Open 8am - 8pm" className={styles.textbox}/>
                                  <Form.Label className={styles.textLabel}>Weekends (Sat - Sun)</Form.Label>
                                  <Form.Control type="text" placeholder="Open 10am - 6pm" className={styles.textbox}/>
                                  <Form.Label className={styles.textLabel}>Holidays</Form.Label>
                                  <Form.Control type="text" placeholder="Closed" className={styles.textbox}/>
                                </Form.Group>
                            </Col>
                          </Row>
                          <div className={styles.invisibleBox}>
                            <Form.Label className={styles.fieldLabel}>Change Password</Form.Label>
                            <Form.Group className={styles.checkBox}>
                              <Row xs={1} md={2}>
                                <Col>
                                    <Form.Label className={styles.textLabel}>New Password</Form.Label>
                                    <Form.Control type="password" />
                                </Col>
                                <Col>
                                  <Form.Label className={styles.textLabel}>Confirm Password</Form.Label>
                                  <Form.Control type="password" />
                                </Col>
                              </Row>
                              <Button className={styles.btn}>Confirm</Button>
                            </Form.Group>
                          </div>
                        </Form>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey='product1'>
                    <>
                      <div className={styles.contentPane}>
                        <h1 className={styles.paneTitle}>New Product</h1>
                        <Form name='newLoot' onSubmit={CreateProduct} autoComplete='off'>
                          <Row>
                            <Col className={styles.pImage}>
                            <Form.Label className={styles.fieldLabel}>Product Image</Form.Label>
                            <Form.Group className='mb-3'>
                              <input name='file' type='file' onChange={e => setFile(e.target.files[0])}/>
                            </Form.Group>
                            <Form.Label className={styles.fieldLabel}>Style</Form.Label>
                            <Form.Group className={styles.style}>
                              <Image src={Loot} className={styles.productImageStyle}/>
                              <Image src={Loot} className={styles.productImageStyle}/>
                              <Image src={Loot} className={styles.productImageStyle}/>
                            </Form.Group>
                            <Form.Label className={styles.fieldLabel}>Product Category</Form.Label>
                            <Form.Group>
                              <Form.Select 
                                  value={product.category}
                                  name='category'
                                  onChange={onChangeSelectInput}
                                  required
                              >
                                  <option value="">Select Category</option>
                                  {categories.map(category => (
                                      <option key={category._id} value={category._id}>{category.name}</option>
                                  ))}
                              </Form.Select>
                            </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Product Name</Form.Label>
                                <Form.Control size="sm" type="text" value={product.productName} name="productName" onChange={ChangeInput} className={styles.textbox}/>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Product Price</Form.Label>
                                <Form.Control type="number" value={product.price} name="price" onChange={ChangeInput} className={styles.textbox}/>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Product Quantity</Form.Label>
                                <Form.Control type="number" value={product.quantity} name="quantity" onChange={ChangeInput} className={styles.textbox}/>
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Product Description</Form.Label>
                                <Form.Control as="textarea" value={product.description} name="description" onChange={ChangeInput} rows={3} className={styles.textbox}/>
                              </Form.Group>
                            </Col>
                          </Row>
                          <Button variant="outline-secondary" type='submit' >Post!</Button>
                        </Form>
                      </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='product2'>
                      <>
                        <div className={styles.contentPane}>
                          <h1 className={styles.paneTitle}>Product List</h1>
                          <Row sm={1} md={2} lg={3} xl={4}>
                            {
                              products.map(product => (
                                <Col className='d-flex justify-content-center'>
                                  <Card className={styles.productCard}>
                                    <Card.Img variant="top" src={require(`../../../../Images/${product.imageName}`)} className={styles.cardImage}/>
                                    <Card.Body className={styles.productCardBody}>
                                      <h1 className={styles.productCardTitle} title={product.name}>{product.productName}</h1>
                                      <h1 className={styles.productCardText}>#{product.price}</h1>
                                      <Button className={styles.productCardBtn}>View</Button>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))
                            }
                          </Row>
                        </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='product3'>
                      <>
                      <div className={styles.contentPane}>
                        <h1 className={styles.paneTitle}>Analytics</h1>
                        <Tabs
                          defaultActiveKey="daily"
                          id="uncontrolled-tab-example"
                          className="mb-3"
                        >
                          <Tab eventKey="daily" title="Daily">
                          <Row className={styles.box}>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Current Sales by Time Period</h2>
                            <Row>
                                <Col><p className={styles.metricTitle}>Monday: 10</p></Col>
                                <Col><p className={styles.metricTitle}>Tuesday: 8</p></Col>
                                <Col><p className={styles.metricTitle}>Wednesday: 6</p></Col>
                                <Col><p className={styles.metricTitle}>Thursday: 4</p></Col>
                                <Col><p className={styles.metricTitle}>Friday: 2</p></Col>
                                <Col><p className={styles.metricTitle}>Saturday: 18</p></Col>
                                <Col><p className={styles.metricTitle}>Sunday: 5</p></Col>
                            </Row>
                            </div>
                          </Row>
                            <Piechart />
                          </Tab>
                          <Tab eventKey="Monthly" title="Monthly">
                          <Row className={styles.box}>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Current Sales Metrics</h2>
                            <Row>
                              <Col>
                              <Row>
                                <Col xs={4}><PiUserFocusThin className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Number of Customers: 962</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={4}><GiMoneyStack className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Revenue: £16580</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={4}><FaClipboardList className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Orders: 1157</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={4}><TbCash className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Average Order Value: 14.3</p></Col>
                              </Row>
                            </Col>
                            </Row>
                            </div>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Previous Sales Metrics</h2>
                            <Row>
                            <Col>
                              <Row>
                                <Col xs={4}><PiUserFocusThin className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Number of Customers: 732</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={4}><GiMoneyStack className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Revenue: £10580</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={4}><FaClipboardList className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Orders: 857</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={4}><TbCash className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Average Order Value: 12.3</p></Col>
                              </Row>
                            </Col>
                            </Row>
                            </div>
                          </Row>
                            <RadarChart />
                          </Tab>
                          <Tab eventKey="Yearly" title="Yearly">
                          <Row className={styles.box}>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Current Sales Metrics</h2>
                            <Row>
                            <Col>
                              <Row>
                                <Col xs={3}><PiUserFocusThin className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Number of Customers: 962</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><GiMoneyStack className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Revenue: £16580</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><FaClipboardList className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Orders: 1157</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><TbCash className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Average Order Value: 14.3</p></Col>
                              </Row>
                            </Col>
                            </Row>
                            </div>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Previous Sales Metrics</h2>
                            <Row>
                            <Col>
                              <Row>
                                <Col xs={3}><PiUserFocusThin className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Number of Customers: 732</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><GiMoneyStack className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Revenue: £10580</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><FaClipboardList className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Orders: 857</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><TbCash className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Average Order Value: 12.3</p></Col>
                              </Row>
                            </Col>
                            </Row>
                            </div>
                          </Row>
                            <LineChart />
                          </Tab>
                        </Tabs>
                      </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='order1'>
                      <>
                        <div className={styles.contentPane}>
                          <h1 className={styles.paneTitle}>Orders</h1>
                          <Tabs
                            defaultActiveKey="Pending"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                          >
                            <Tab eventKey="All" title="All">
                            <div className={styles.dColumn}>
                              {
                                order.map(orderItem => (
                                  <Row className={styles.order}>
                                    <Col xs={3} className={styles.orderPicBox}>
                                      {/* <img src={require(`../../../../Images/${orderItem.product[0].imageName}`)} alt='loot' className={styles.orderPic}/> */}
                                    </Col>
                                    <Col xs={4} className={styles.orderTextBox}>
                                      <p className={styles.orderText}>{orderItem.product[0].productName}</p>
                                      <p className={styles.orderText}>{orderItem.quantity} X £{orderItem.product[0].price} = £{orderItem.quantity * orderItem.product[0].price}</p>
                                      <Form.Select 
                                        value={orderItem.status}
                                        name='newStatus'
                                        onChange={(e) => handleStatusChange(orderItem.orderId, e.target.value)}
                                        required
                                      >
                                        {uniqueStatuses.map(status => (
                                          <option key={status} value={status}>{status}</option>
                                        ))}
                                      </Form.Select>
                                    </Col>
                                    <Col xs={4} className={styles.orderTextBox}>
                                      <p className={styles.orderText}>{orderItem.shopper}</p>
                                      <p className={styles.orderText}>Door Delivery</p>
                                      <p className={styles.orderText}>11 Kings View Rd.</p>
                                    </Col>
                                  </Row>
                                ))
                              }
                            </div>
                            </Tab>
                            {
                            uniqueStatuses.map(status => (
                                <Tab eventKey={status} title={status}>
                                    {
                                        order.filter(orderItem => orderItem.status === status).map(filteredOrder => (
                                          <Row className={styles.order}>
                                            <Col xs={3} className={styles.orderPicBox}>
                                              {/* <img src={require(`../../../../Images/${filteredOrder.product[0].imageName}`)} alt='loot' className={styles.orderPic}/> */}
                                            </Col>
                                            <Col xs={4} className={styles.orderTextBox}>
                                              <p className={styles.orderText}>{filteredOrder.product[0].productName}</p>
                                              <p className={styles.orderText}>{filteredOrder.quantity} X £{filteredOrder.product[0].price} = £{filteredOrder.quantity * filteredOrder.product[0].price}</p>
                                              <Form.Select 
                                                value={filteredOrder.status}
                                                name='newStatus'
                                                onChange={(e) => handleStatusChange(filteredOrder.orderId, e.target.value)}
                                                required
                                              >
                                                {uniqueStatuses.map(status => (
                                                  <option key={status} value={status}>{status}</option>
                                                ))}
                                              </Form.Select>
                                            </Col>
                                            <Col xs={4} className={styles.orderTextBox}>
                                              <p className={styles.orderText}>{filteredOrder.shopper}</p>
                                              <p className={styles.orderText}>Door Delivery</p>
                                              <p className={styles.orderText}>11 Kings View Rd.</p>
                                            </Col>
                                          </Row>
                                        ))
                                    }
                                </Tab>
                            ))
                        }
                          </Tabs>
                        </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='order2'>
                      <>
                        <div className={styles.contentPane}>
                          <Tabs
                              defaultActiveKey="policy"
                              id="uncontrolled-tab-example"
                              className="mb-3"
                            >
                                <Tab eventKey="policy" title="Update Policies">
                                <div className={styles.contentPane}>
                                    <h1 className={styles.paneTitle}>Refunds & Returns</h1>
                                    <p className={styles.paneText}>Welcome to our Refund & Returns Policy page. At [Your Company Name], we are committed to ensuring your satisfaction with every purchase. This policy is designed to provide you with clear information on how to request refunds or returns for products purchased on our website. Please take a moment to read through the following guidelines to understand our process better.</p>
                                    <div className={styles.refBox}>
                                      <h4 className={styles.boxTitle}>Refunds</h4>
                                      <label className={styles.refLabel}>Refund Eligibility:</label>
                                      <ol>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='You may request a refund within [X] days from the date of purchase.'/></li>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='To be eligible for a refund, the item must be in its original condition and packaging.'/></li>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='Refunds are typically processed to the original payment method.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>How to Request a Refund:</label>
                                      <ol>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='To initiate a refund request, please contact our customer support team at [Customer Support Email] or call [Customer Support Phone Number].'/></li>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='Our team will guide you through the process and provide you with a Return Merchandise Authorization (RMA) number if necessary.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>Exceptions:</label>
                                      <ol>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='Some items, such as personalized or digital products, are non-refundable.'/></li>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='Shipping and handling fees are non-refundable unless there was an error in the shipment.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>Refund Processing Time:</label>
                                      <ol>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='Refunds will be processed within [X] business days after receiving the returned item.'/></li>
                                      </ol>
                                      <p className={styles.paneText}>[Your Company Name] reserves the right to refuse refunds if the above criteria are not met.</p>
                                    </div>
                                    <div className={styles.refBox}>
                                      <h4 className={styles.boxTitle}>Returns</h4>
                                      <label className={styles.refLabel}>Return Eligibility:</label>
                                      <ol>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='You may request a return within [X] days from the date of purchase.'/></li>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='The item must be in its original condition and packaging for us to accept the return.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>How to Initiate a Return:</label>
                                      <ol>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='To start the return process, please contact our customer support team at [Customer Support Email] or call [Customer Support Phone Number].'/></li>
                                        <li><Form.Control type="text" className={styles.refInputbox} placeholder='Our team will guide you through the necessary steps and provide you with a Return Merchandise Authorization (RMA) number if required.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>Restocking Fees:</label>
                                      <ol>
                                      <li><Form.Control type="text" className={styles.refInputbox} placeholder='A restocking fee of [X]% may apply to certain returns. This fee helps cover processing and handling costs.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>Return Shipping:</label>
                                      <ol>
                                      <li><Form.Control type="text" className={styles.refInputbox} placeholder='Customers are responsible for return shipping costs unless the return is due to a mistake on our part.'/></li>
                                      </ol>
                                      <label className={styles.refLabel}>Return Processing Time:</label>
                                      <ol>
                                      <li><Form.Control type="text" className={styles.refInputbox} placeholder='Returns will be processed within [X] business days after receiving the returned item.'/></li>
                                      </ol>
                                      <p className={styles.paneText}>[Your Company Name] reserves the right to refuse returns if the above conditions are not met.</p>
                                    </div>
                                  </div>
                                </Tab>
                                <Tab eventKey="refund" title="Open Refunds">
                                  <div className={styles.dColumn}>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Payment Type: Bank Transfer</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: Bank Refund</p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Payment Type: Paypal</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: Instant Transfer</p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Payment Type: Card Payment</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Payment Type: Apple Pay</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Payment Type: Store Credit</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Tab>
                                <Tab eventKey="return" title="Closed Refunds">
                                    <div className={styles.dColumn}>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Bank Account</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Bank Account</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Bank Account</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                    <Row className={styles.order}>
                                      <Col xs={3} className={styles.orderPicBox}>
                                        <img src={Loot} alt='loot' className={styles.orderPic}/>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Purple Pineapple</p>
                                        <p className={styles.orderText}>6 X £4 = £24</p>
                                        <p className={styles.orderText}>Bank Account</p>
                                      </Col>
                                      <Col xs={4} className={styles.orderTextBox}>
                                        <p className={styles.orderText}>Big Sosa</p>
                                        <p className={styles.orderText}>Reason: - </p>
                                        <p className={styles.orderText}>Refund Type: </p>
                                      </Col>
                                    </Row>
                                    </div>
                                </Tab>
                          </Tabs>
                        </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='sale1'>
                      <>
                        <div className={styles.contentPane}>
                          <h1 className={styles.paneTitle}>Sales Overview</h1>
                          <Row className={styles.box}>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Current Sales Metrics</h2>
                            <Row>
                            <Col>
                              <Row>
                                <Col xs={3}><PiUserFocusThin className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Number of Customers: 962</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><GiMoneyStack className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Revenue: £16580</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><FaClipboardList className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Orders: 1157</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><TbCash className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Average Order Value: 14.3</p></Col>
                              </Row>
                            </Col>
                            </Row>
                            </div>
                            <div className={styles.invisibleBox}>
                            <h2 className={styles.salesTitle}>Previous Sales Metrics</h2>
                            <Row>
                            <Col>
                              <Row>
                                <Col xs={3}><PiUserFocusThin className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Number of Customers: 732</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><GiMoneyStack className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Revenue: £10580</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><FaClipboardList className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Total Orders: 857</p></Col>
                              </Row>
                            </Col>
                            <Col>
                              <Row>
                                <Col xs={3}><TbCash className={styles.merIcon}/></Col>
                                <Col><p className={styles.metricTitle}>Average Order Value: 12.3</p></Col>
                              </Row>
                            </Col>
                            </Row>
                            </div>
                          </Row>
                          <BarChart />
                          <HorChart />
                        </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='sale2'>
                      <>
                        <div className={styles.contentPane}>
                          <h1 className={styles.paneTitle}>Product Promotions</h1>
                          <Tabs
                          defaultActiveKey="all"
                          id="uncontrolled-tab-example"
                          className="mb-3"
                          >
                          <Tab eventKey="new" title="New Promotion">
                            <Form className={styles.box}>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Promotion Name</Form.Label>
                                <Form.Control type="text" placeholder="New Year New Me" />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Promotion Description</Form.Label>
                                <Form.Control type="text" placeholder="New Year New Me promotion" />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label className={styles.fieldLabel}>Promotion Duration (In Days)</Form.Label>
                                <Form.Control type="num" placeholder="14" />
                              </Form.Group>
                            </Form>
                            <h2 className={styles.boxTitle}>Promotion Type</h2>
                            <div className={styles.box}>
                              <Tabs
                                defaultActiveKey="discount"
                                id="uncontrolled-tab-example"
                                className='mb-3'
                              >
                                <Tab eventKey="discount" title="Discount">
                                  <Form>
                                    <Form.Group className="mb-3">
                                      <Form.Label className={styles.fieldLabel}>Discount Name</Form.Label>
                                      <Form.Control type="text" placeholder="BigSosa" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label className={styles.fieldLabel}>Discount Code</Form.Label>
                                      <Form.Control type="text" placeholder="1HVE13IGD" />
                                    </Form.Group>
                                  </Form>
                                </Tab>
                                <Tab eventKey="coupon" title="Coupon">
                                  <Form>
                                    <Form.Group className="mb-3">
                                      <Form.Label className={styles.fieldLabel}>Coupon Name</Form.Label>
                                      <Form.Control type="text" placeholder="LilSosa" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label className={styles.fieldLabel}>Coupon Code</Form.Label>
                                      <Form.Control type="text" placeholder="1HVE13IGD" />
                                    </Form.Group>
                                  </Form>
                                </Tab>
                                <Tab eventKey="bundle" title="Bundle Deal">
                                  <Form>
                                    <Form.Group className="mb-3">
                                      <Form.Label className={styles.fieldLabel}>Bundle Deal Name</Form.Label>
                                      <Form.Control type="text" placeholder="AllSosa" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                      <Form.Label className={styles.fieldLabel}>Bundle Deal Products</Form.Label>
                                      <Form.Control type="text" placeholder="1HVE13IGD" />
                                    </Form.Group>
                                  </Form>
                                </Tab>
                              </Tabs>
                            </div>
                          </Tab>
                          <Tab eventKey="all" title="All Promotions">
                              <div className={styles.dColumn}>
                                <Row className={styles.order}>
                                  <Col xs={3} className={styles.orderPicBox}>
                                    <img src={Loot} alt='loot' className={styles.orderPic}/>
                                  </Col>
                                  <Col xs={4} className={styles.orderTextBox}>
                                    <p className={styles.orderText}>Discount</p>
                                    <p className={styles.orderText}>AllSosa</p>
                                    <p className={styles.orderText}>Paused</p>
                                  </Col>
                                  <Col xs={4} className={styles.orderTextBox}>
                                    <p className={styles.orderText}>1HVE13IGD</p>
                                    <p className={styles.orderText}>New Year New Me </p>
                                    <p className={styles.orderText}>5 Days</p>
                                  </Col>
                                </Row>
                                <Row className={styles.order}>
                                  <Col xs={3} className={styles.orderPicBox}>
                                    <img src={Loot} alt='loot' className={styles.orderPic}/>
                                  </Col>
                                  <Col xs={4} className={styles.orderTextBox}>
                                    <p className={styles.orderText}>Bundle Deal</p>
                                    <p className={styles.orderText}>LilSosa</p>
                                    <p className={styles.orderText}>Expired</p>
                                  </Col>
                                  <Col xs={4} className={styles.orderTextBox}>
                                    <p className={styles.orderText}>1HVE13IGD</p>
                                    <p className={styles.orderText}>New Year New Me </p>
                                    <p className={styles.orderText}>5 Days</p>
                                  </Col>
                                </Row>
                                <Row className={styles.order}>
                                  <Col xs={3} className={styles.orderPicBox}>
                                    <img src={Loot} alt='loot' className={styles.orderPic}/>
                                  </Col>
                                  <Col xs={4} className={styles.orderTextBox}>
                                    <p className={styles.orderText}>Coupon</p>
                                    <p className={styles.orderText}>BigSosa</p>
                                    <p className={styles.orderText}>On Going</p>
                                  </Col>
                                  <Col xs={4} className={styles.orderTextBox}>
                                    <p className={styles.orderText}>1HVE13IGD</p>
                                    <p className={styles.orderText}>New Year New Me </p>
                                    <p className={styles.orderText}>5 Days</p>
                                  </Col>
                                </Row>
                              </div>
                          </Tab>
                        </Tabs>
                        </div>
                      </>
                    </Tab.Pane>
                    <Tab.Pane eventKey='sale3'>
                      <>
                        <div className={styles.contentPane}>
                          <h1 className={styles.paneTitle}>Reviews</h1>
                          <Row sm={1} md={2} lg={3} xl={4}>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                            <Col className='d-flex justify-content-center'>
                              <Card className={styles.reviewCard}>
                                <Card.Img variant="top" src={Loot} className={styles.cardImage}/>
                                <Card.Body className={styles.reviewCardBody}>
                                  <h1 className={styles.reviewCardTitle}>Shopper</h1>
                                  <h1 className={styles.reviewCardText}>This pineapple is a showstopper! Loved the taste and the color is just stunning.</h1>
                                  <div>
                                    <Row>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiFillStar /></Col>
                                      <Col xs={2}><AiOutlineStar /></Col>
                                    </Row>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </div>
                      </>
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
