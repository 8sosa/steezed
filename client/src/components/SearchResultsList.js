import React from "react";
import styles from './index.module.css';
import { Link } from 'react-router-dom';



export default function SearchResults ( {filteredProducts} ) {
   
    return (
        <>
            <div className={styles.searchResults}>
                <ul>
                    <h1 className={styles.searchResultHeader}>Products</h1>
                    {
                        filteredProducts.map((result, id) => (
                            <li key={id}><Link to={`/p/api/products/${result._id}`} className={styles.searchResult}>{result.productName}</Link></li>
                        ))
                    }
                    <h1 className={styles.searchResultHeader}>Merchants</h1>
                    {
                        filteredProducts.map((result, id) => (
                            <li key={id}><Link to={`/shop/${result._id}`} className={styles.searchResult}>{result.shopName}</Link></li>
                        ))
                    }
                </ul>
            </div>  
        </>
    )
}