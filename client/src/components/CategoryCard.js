import React from "react";
import {Link} from 'react-router-dom';
import { Card } from 'react-bootstrap'
import styles from './index.module.css';




export default function Category({category}) {
    return (
        <Card className={styles.category} key={category._id}>
            <Link to={`category/${category._id}/products`}>
            <Card.Img variant="top" src={require(`../../../Images/${category.imageName}`)} className={styles.cardImage}/>
            </Link>
            <Card.Body>
                <Card.Text href='/category' className={styles.categoryTitle}>
                {category.name}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}