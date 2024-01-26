import React from "react";
import {Link} from 'react-router-dom';
import { Card } from 'react-bootstrap'
import styles from './index.module.css';

export default function Product({relatedProduct}) {
    return (
        <Link to={`/api/products/${relatedProduct._id}`} key={"lrp"+relatedProduct._id} className={styles.link}>
            <Card className={styles.product}>
                    <Card.Img variant="top" src={require(`../../../Images/${relatedProduct.imageName}`)} className={styles.productImage}/>
                <Card.Body className={styles.productBody}>
                    <Card.Title className={styles.productTitle} title={relatedProduct.productName}>
                        {relatedProduct.productName}
                    </Card.Title>
                    <Card.Text className={styles.productTitle}>
                        #{relatedProduct.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}