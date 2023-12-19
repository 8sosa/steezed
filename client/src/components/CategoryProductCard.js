import React from "react";
import {Link} from 'react-router-dom';
import { Row, Card, Col } from 'react-bootstrap'
import styles from './index.module.css';

export default function Product({categoryProduct}) {
    console.log(categoryProduct)
    return (
        <Card className={styles.category}>
            <Link to={`/api/products/${categoryProduct._id}`}>
                <Card.Img variant="top" src={require(`../../../Images/${categoryProduct.imageName}`)} className={styles.cardImage}/>
            </Link>
            <Card.Body className={styles.categoryCardBody}>
                <Row className="d-flex">
                    <Col>
                        <Card.Title className={styles.categoryTitle} title={categoryProduct.productName}>
                            {categoryProduct.productName}
                        </Card.Title>
                    </Col>
                    <Col>
                        <Card.Text className={styles.categoryPrice}>
                            #{categoryProduct.price}
                        </Card.Text>
                    </Col>
                </Row>
                <Card.Text className={styles.lootDescription}>
                    {categoryProduct.description}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}