import React from "react";
import {Link} from 'react-router-dom';
import { Card } from 'react-bootstrap'
import styles from './index.module.css';




export default function Category({category}) {
    return (
        <Link to={`category/${category._id}/products`} className={styles.link}>
            <Card className={styles.category} key={category._id}>
                <Card.Img variant="top" src={require(`../../../Images/${category.imageName}`)} className={styles.categoryImage}/>
                <Card.Body className={styles.categoryBody}>
                    <Card.Text href='/category' className={styles.categoryTitle}>
                    {category.name}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Link>
    )
}