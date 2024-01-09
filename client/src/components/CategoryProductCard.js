import React from "react";
import {Link} from 'react-router-dom';
import { Row, Card, Col } from 'react-bootstrap'
import styles from './index.module.css';

export default function Product({relatedProduct}) {
    return (
        <Link to={`/api/products/${relatedProduct._id}`}>
            <Card className={styles.category}>
                    <Card.Img variant="top" src={require(`../../../Images/${relatedProduct.imageName}`)} className={styles.cardImage}/>
                <Card.Body className={styles.categoryCardBody}>
                    <Row className="d-flex">
                        <Col>
                            <Card.Title className={styles.categoryTitle} title={relatedProduct.productName}>
                                {relatedProduct.productName}
                            </Card.Title>
                        </Col>
                        <Col>
                            <Card.Text className={styles.categoryPrice}>
                                #{relatedProduct.price}
                            </Card.Text>
                        </Col>
                    </Row>
                    <Card.Text className={styles.lootDescription}>
                        {relatedProduct.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}