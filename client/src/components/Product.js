import React from "react";
import {Link} from 'react-router-dom';
import { Row, Card, Col } from 'react-bootstrap'
import styles from './index.module.css';

export default function Product({ product }) {
    return (
        <Link to={`/api/products/${product._id}`} className={styles.link}>
            <Card className={styles.loot} key={product._id}>
                <Card.Img variant="top" src={require(`../../../Images/${product.imageName}`)} className={styles.cardImage}/>
                <Card.Body>
                    <Row className={styles.lootHeader}>
                        <Col>
                            <Card.Title className={styles.lootTitle} title={product.productName}>
                            {product.productName}
                            </Card.Title>
                        </Col>
                        <Col>
                            <Card.Text className={styles.lootPrice}>
                                #{product.price}
                            </Card.Text>
                        </Col>
                    </Row>
                    <Card.Text className={styles.lootDescription}>
                        {product.description}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}