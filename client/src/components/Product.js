import React from "react";
import {Link} from 'react-router-dom';
import { Card } from 'react-bootstrap'
import styles from './index.module.css';

export default function Product({ product }) {
    return (
        <Link to={`/api/products/${product._id}`} className={styles.link} key={'p'+product._id}>
            <Card className={styles.product}>
                <Card.Img variant="top" src={require(`../../../Images/${product.imageName}`)} className={styles.productImage}/>
                <Card.Body className={styles.productBody}>
                    <Card.Title className={styles.productTitle} title={product.productName}>
                        {product.productName}
                    </Card.Title>
                    <Card.Text className={styles.productTitle}>
                        #{product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}