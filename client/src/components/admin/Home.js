import React, { useEffect, useState, useContext} from 'react'
import axios from 'axios';
import { Form, Card, AccordionContext, Button, Tabs, Col, Container, Nav, Row, Tab, useAccordionButton, Image} from 'react-bootstrap'
import styles from './index.module.css'
import { CiSearch } from 'react-icons/ci'
import Pic from '../images/piced.png'
import Loot from '../images/bigloot.png'
import Backdrop from '../images/backdrop.png'



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

export default function Home() {
  const [activeTab, setActiveTab] = useState('users')
  const [shoppers, setShoppers] = useState([])
  const [sellers, setSellers] = useState([])
  const [category, setCategory] = useState({name: ''})
  const [categories, setCategories] = useState([])
  const [tokenStore, setToken] = useState('')
  const [file, setFile] = useState()



  const handleTabSelect = (selectedTab) => {
      setActiveTab(selectedTab);
  }

  const getCategories = async (token) =>{
    const res = await axios.get('category', {
        headers:{Authorization: tokenStore}
    })
    setCategories(res.data)
  }

  const ChangeInput = d => {
    const {name, value} = d.target;
    setCategory({...category, [name]:value})
  }

  const createCategory = async e => {
    e.preventDefault()
    const form = document.forms.namedItem('category');
    const formData = new FormData(form)
    const res = await axios.post(`/category/image`, formData, {
      headers: {Authorization: tokenStore}
    })
    console.log(file)
    console.log(res)
  }

  const getShoppers = async (token) => {
    const res = await axios.get('/shopper', {
      headers: {Authorization: token}
    })
    setShoppers(res.data)
  }
  
  const getSellers = async (token) => {
    const res = await axios.get('/seller', {
      headers: {Authorization: token}
    })
    setSellers(res.data)
  }

  useEffect(() => {
    const token = localStorage.getItem('tokenStore')
    if(token){
      setToken(token)
      getShoppers(token)
      getSellers(token)
      getCategories(token)
    }
  }, [])
      
  return (
    <>
      <Container className={styles.page}>
        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
          <Row>
              <Col xs={4}>
              <section className={styles.sidebar}>
                <Button className={styles.searchBtn}><CiSearch className={styles.searchIcon}/> Search</Button>
              <Nav>
                <Nav.Item>
                  <Nav.Link className={styles.navLin} eventKey='users'><ContextAwareToggle>User Management</ContextAwareToggle></Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className={styles.navLin} eventKey='site'><ContextAwareToggle>Site Management</ContextAwareToggle></Nav.Link>
                </Nav.Item>
              </Nav>
              </section>
              </Col>
              <Col xs={8}>
                <section className={styles.content}>
                  <Tab.Content>
                    <Tab.Pane eventKey='users'>
                      <div className={styles.contentPane}>
                      <h1 className={styles.paneTitle}>User Management</h1>
                        <Tabs
                          defaultActiveKey="shoppers"
                          id="uncontrolled-tab-example"
                          className="mb-3"
                        >
                          <Tab eventKey="shoppers" title="Adventurers">
                          <div className={styles.user}>
                            {
                              shoppers.map(shopper => (
                                <Row className={styles.fullWidht}>
                                  <Col className={styles.orderPicBox}>
                                    <img src={Pic} alt='loot' className={styles.orderPic}/>
                                  </Col>
                                  <Col className={styles.orderTextBox}>
                                    <p className={styles.orderText}>{shopper.userName}</p>
                                    <p className={styles.orderText}>{shopper.email}</p>
                                    <p className={styles.orderText}>{shopper.phoneNumber}</p>
                                  </Col>
                                  <Col className={styles.orderBtnBox}>
                                    <button className={styles.banBtn}>Delete</button>
                                  </Col>
                                </Row>
                              ))
                            }
                            {console.log(shoppers)}
                          </div>
                          </Tab>
                          <Tab eventKey="sellers" title="Merchants">
                          <div className={styles.dColumn}>
                              {
                                sellers.map(seller => (
                                  <Row className={styles.user}>
                                    <Col xs={3} className={styles.orderPicBox}>
                                      <img src={Pic} alt='loot' className={styles.orderPic}/>
                                    </Col>
                                    <Col xs={4} className={styles.orderTextBox}>
                                      <p className={styles.orderText}>{seller.shopName}</p>
                                      <p className={styles.orderText}>{seller.email}</p>
                                      <p className={styles.orderText}>{seller.userName}</p>
                                    </Col>
                                    <Col xs={4} className={styles.orderBtnBox}>
                                      <button className={styles.banBtn}>Delete</button>
                                    </Col>
                                  </Row>
                                ))
                              }
                          </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey='site'> 
                    <div className={styles.contentPane}>
                      <h1 className={styles.paneTitle}>Site Settings</h1>
                      <Tabs
                        defaultActiveKey="content"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                      >
                        <Tab eventKey="content" title="Content">
                          <h1 className={styles.boxTitle}>Category</h1>
                          <div className={styles.box}>
                            <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className="mb-3">
                              <Tab eventKey="all" title="All Categories">
                              <Row sm={1} md={2} lg={3} xl={4}>
                                {
                                  categories.map(category => (
                                    <Col className='d-flex justify-content-center'>
                                      <Card className={styles.categoryCard}>
                                        <Card.Img variant="top" src={require(`../../../../Images/${category.imageName}`)} className={styles.cardImage}/>
                                        <Card.Body>
                                          <p className={styles.categoryCardText}>{category.name}</p>
                                        </Card.Body>
                                      </Card>
                                    </Col>
                                  ))
                                }
                              </Row>
                              </Tab>
                              <Tab eventKey="new" title="New Category">
                                <Form name="category" >
                                  <Form.Label className={styles.fieldLabel}>New Category</Form.Label>
                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className={styles.categoryImage}><Image src={Loot} alt='loot' className={styles.categoryImage}/></Form.Label>
                                    <Form.Control name='file' type='file' onChange={e => setFile(e.target.files[0])} size="sm" />
                                  </Form.Group>
                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className={styles.fieldLabel}>Category Name:</Form.Label>
                                    <Form.Control type="text" name="name" value={category.name} onChange={ChangeInput} placeholder="Fruits" />
                                  </Form.Group>
                                  <Button variant="primary" type='submit' onClick={createCategory}>Save Category</Button>
                                </Form>
                              </Tab>
                            </Tabs>
                          </div>
                          <h1 className={styles.boxTitle}>Hero</h1>
                          <Form className={styles.box}>
                            <img src={Backdrop} alt='backdrop' fluid className={styles.backdrop}/>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                              <Form.Label className={styles.categoryCardText} >Select Image</Form.Label>
                              <Form.Control type="file" size="sm" />
                            </Form.Group>
                          </Form>
                        </Tab>
                        <Tab eventKey="setting" title="Settings" disabled>
                        <p>For future updates to be added site wide like changing currency, language, base color and such...</p>
                        </Tab>
                      </Tabs>
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