import React, { useState, useEffect } from "react";
import axios from 'axios';
import { GoSearch } from "react-icons/go";
import styles from './index.module.css';
import { Button, Form } from 'react-bootstrap';
import SearchResults from "./SearchResultsList";


export default function SearchBar () {
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sellers, setSellers] = useState([]);
  
  
    const getSellers = async (token) => {
      const res = await axios.get('/seller', {
        headers: {Authorization: token}
      })
      setSellers(res.data)
    }
  
    const getProducts = async (token) => {
      try {
          const res = await axios.get('/api/products');
          setProducts(res.data);
      } catch (error) {
          console.log(error);
      }
    }
  
    const handleSearch = (value) => {
        setSearch(value);
      
        const filteredProducts = value
          ? products.filter((product) =>
              product.productName.toLowerCase().includes(value.toLowerCase())
            )
          : [];
      
        const filteredSellers = value
          ? sellers.filter((seller) =>
              seller.shopName.toLowerCase().includes(value.toLowerCase())
            )
          : [];
      
        setFilteredProducts([...filteredProducts, ...filteredSellers]);
      };


    useEffect(() => {
        getProducts()
        getSellers()
      }, []);

    return (
        <>
            <div className={styles.searchBar}>
                <Form className="d-flex mx-auto position-relative">
                    <Form.Control
                    type="search"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search"
                    className={styles.searchField}
                    aria-label="Search"
                    />
                    <Button variant="outline-success" className={styles.navSearchBtn}><GoSearch /></Button>
                </Form>
                {filteredProducts.length > 0 && (
                  <div className={styles.resultsContainer}>
                    <SearchResults filteredProducts={filteredProducts}/>
                  </div>                
                )}
            </div>
        </>
    )
}