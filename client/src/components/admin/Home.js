import React, { useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Card, AccordionContext, Button, Tabs, Col, Container, Nav, Row, Tab, useAccordionButton, Table, Offcanvas } from 'react-bootstrap'
import styles from './index.module.css'
import checkLogin from './auth';
import { CiSearch } from 'react-icons/ci'
import { CgMenuRightAlt } from "react-icons/cg";


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
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [activeTab, setActiveTab] = useState('users')
  const [shoppers, setShoppers] = useState([])
  const [sellers, setSellers] = useState([])
  const [category, setCategory] = useState({name: ''})
  const [categories, setCategories] = useState([])
  const [tokenStore, setToken] = useState('')
  const [file, setFile] = useState()

  const logout = () => {
    localStorage.removeItem('tokenStore');
    navigate(`/a/secret/admin/login`)
  };

  const handleTabSelect = (selectedTab) => {
      setActiveTab(selectedTab);
  }

  const getCategories = async () =>{
    try {
        const res = await axios.get('/category')
        setCategories(res.data)
    } catch (error) {
        console.log(error)
    }
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
    const fetchData = async () => {
      const isUserLoggedIn = await checkLogin();

      if (isUserLoggedIn) {
        getCategories()
        const token = localStorage.getItem('tokenStore')
        if(token){
          setToken(token)
          getShoppers(token)
          getSellers(token)
        }
      } else {
        navigate(`/a/secret/admin/login`)
      }
    };

    fetchData();
  }, [])
      
  return (
    <>
      <Container className={styles.page}>
        <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
          <Row className={styles.pageContent}>
              <Col lg={'auto'}>
                <section className={styles.sidebar}>
                  <Button className={styles.searchBtn}><CiSearch className={styles.searchIcon}/> Search</Button>
                  <Nav className='d-flex flex-column align-items-center'>
                    <Nav.Item>
                      <Nav.Link className={styles.navLin} eventKey='users'><ContextAwareToggle>User Management</ContextAwareToggle></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className={styles.navLin} eventKey='site'><ContextAwareToggle>Site Management</ContextAwareToggle></Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Button onClick={() => logout()} className={styles.logBoxBtn}>Logout</Button>
                </section>
              </Col>
              <Col lg={8} className={styles.adminContent}>
                <section className={styles.content}>
                  <Tab.Content>
                    <Offcanvas show={show} onHide={handleClose} placement='end' className={styles.adminMenu}>
                      <Offcanvas.Header closeButton>
                      </Offcanvas.Header>
                      <Offcanvas.Body>
                        <section className={styles.sidebarCanvas}>
                          <Button className={styles.searchBtn}><CiSearch className={styles.searchIcon}/> Search</Button>
                          <Nav className='d-flex flex-column m-3'>
                            <Nav.Item>
                              <Nav.Link className={styles.navLin} eventKey='users'><ContextAwareToggle>User Management</ContextAwareToggle></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link className={styles.navLin} eventKey='site'><ContextAwareToggle>Site Management</ContextAwareToggle></Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Button onClick={() => logout()} className={styles.logBoxBtn}>Logout</Button>
                        </section>
                      </Offcanvas.Body>
                    </Offcanvas>
                    <Tab.Pane eventKey='users'>
                      <div className={styles.contentPane}>
                        <div className={styles.paneTitleBlock}>
                          <h1 className={styles.paneTitle}>User Management</h1>
                          <Button onClick={handleShow} className={styles.filter}><CgMenuRightAlt size={12}/></Button>
                        </div>
                        <Tabs
                          defaultActiveKey="shoppers"
                          id="uncontrolled-tab-example"
                          className="mb-3"
                        >
                          <Tab eventKey="shoppers" title={<h1 className={styles.tabTitle}>Adventurers</h1>} >
                            <Table>
                              <thead >
                                <tr>
                                  <th className={styles.tHead} key={'userName'}>User Name</th>
                                  <th className={styles.tHead} key={'email'}>Email</th>
                                  <th className={styles.tHead} key={'phoneNumber'}>Phone Number</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  shoppers.map(shopper => (
                                    <tr key={shopper._id}>
                                      <td className={styles.tBody} key={shopper.userName}>{shopper.userName}</td>
                                      <td className={styles.tBody} key={shopper.email}>{shopper.email}</td>
                                      <td className={styles.tBody} key={shopper.phoneNumber}>{shopper.phoneNumber}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </Table>
                          </Tab>
                          <Tab eventKey="sellers" title={<h1 className={styles.tabTitle}>Merchants</h1>}>
                          <Table>
                              <thead>
                                <tr>
                                  <th className={styles.tHead} key={'shopName'}>Shop Name</th>
                                  <th className={styles.tHead} key={'Email'}>Email</th>
                                  <th className={styles.tHead} key={'seller'}>Seller</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                sellers.map(seller => (
                                  <tr key={seller._id}>
                                    <td className={styles.tBody} key={seller.shopName}>{seller.shopName}</td>
                                    <td className={styles.tBody} key={seller.email}>{seller.email}</td>
                                    <td className={styles.tBody} key={seller.userName}>{seller.userName}</td>
                                  </tr>
                                  ))
                                }
                              </tbody>
                            </Table>
                          </Tab>
                        </Tabs>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey='site'> 
                    <div className={styles.contentPane}>
                      <div className={styles.paneTitleBlock}>
                      <h1 className={styles.paneTitle}>Site Settings</h1>
                          <Button onClick={handleShow} className={styles.filter}><CgMenuRightAlt size={12}/></Button>
                        </div>
                      <Tabs
                        defaultActiveKey="content"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                      >
                        <Tab eventKey="content" title="Content">
                            <Tabs defaultActiveKey="all" id="uncontrolled-tab-example" className="mb-3">
                              <Tab eventKey="all" title={<h1 className={styles.tabTitle}>All Categories</h1>}>
                              <Row sm={2} md={2} lg={3} xl={4}>
                                {
                                  categories.map(category => (
                                    <Col className='d-flex justify-content-center' key={category._id}>
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
                              <Tab eventKey="new" title={<h1 className={styles.tabTitle}>New Categories</h1>}>
                                <Form name="category" >
                                  <Form.Label className={styles.fieldLabel}>New Category</Form.Label>
                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Control name='file' type='file' onChange={e => setFile(e.target.files[0])} size="sm" className={styles.categoryImage} />
                                  </Form.Group>
                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label className={styles.fieldLabel}>Category Name:</Form.Label>
                                    <Form.Control type="text" name="name" value={category.name} onChange={ChangeInput} className={styles.inputField} placeholder="Fruits" />
                                  </Form.Group>
                                  <Button className={styles.saveBtn} type='submit' onClick={createCategory}>Save Category</Button>
                                </Form>
                              </Tab>
                            </Tabs>
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