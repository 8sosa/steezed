import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.css';
import Product from '../Product'
import Category from '../CategoryCard'

export default function Home(){
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([])

    const getProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    }
    const getCategories = async () =>{
        try {
            const res = await axios.get('category')
            setCategories(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getProducts()
        getCategories()
    }, [])

    return (
        <>
            <Container className={styles.homePage}>
                <section className={styles.hero}>
                </section>
                <section className={styles.steals}>
                    <h2 className={styles.bgText}>Steals</h2>                        
                    <Row xs={2} sm={2} md={4} className='d-flex g-4 justify-content-center'>
                        {
                            products.slice(0, 4).map(product => (
                                <Col className='d-flex justify-content-center' key={product._id}>
                                    <Product product={product}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
                <section className={styles.categories}>
                    <h2 className={styles.bgText}>categories</h2>
                    <Row xs={4} md={4} className="g-4">
                        {
                            categories.slice(0, 4).map(category => (
                                <Col className='d-flex justify-content-center' key={category._id}>    
                                    <Category category={category}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
                <section className={styles.steals}>
                    <h2 className={styles.bgText}>Black Friday!</h2>                        
                    <Row xs={2} sm={2} md={4} className='d-flex g-4 justify-content-center'>
                        {
                            products.slice(4, 12).map(product => (
                                <Col className='d-flex justify-content-center' key={product._id}>
                                    <Product product={product}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
                <section className={styles.categories}>
                    <h2 className={styles.bgText}>categories</h2>
                    <Row xs={4} md={4} className="g-4">
                        {
                            categories.slice(4, 8).map(category => (
                                <Col className='d-flex justify-content-center' key={category._id}>    
                                    <Category category={category}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
                <section className={styles.steals}>
                    <h2 className={styles.bgText}>For the Dawgs!!!</h2>                        
                    <Row xs={2} sm={2} md={4} className='d-flex g-4 justify-content-center'>
                        {
                            products.slice(12, 20).map(product => (
                                <Col className='d-flex justify-content-center' key={product._id}>
                                    <Product product={product}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
                <section className={styles.categories}>
                    <h2 className={styles.bgText}>categories</h2>
                    <Row xs={4} md={4} className="g-4">
                        {
                            categories.slice(8, 12).map(category => (
                                <Col className='d-flex justify-content-center' key={category._id}>    
                                    <Category category={category}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
                <section className={styles.steals}>
                    <h2 className={styles.bgText}>Last Chance</h2>                        
                    <Row xs={2} sm={2} md={4} className='d-flex g-4 justify-content-center'>
                        {
                            products.slice(20, 28).map(product => (
                                <Col className='d-flex justify-content-center' key={product._id}>
                                    <Product product={product}/>
                                </Col>
                            ))
                        }
                    </Row>
                </section>
            </Container>       
        </>
    )
}