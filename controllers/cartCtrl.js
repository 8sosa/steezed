const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


const cartCtrl = {
  getCart: async (req, res) => {
    try {
      // Retrieve the cart for the shopper
      let cart = await Cart.findOne({ shopper: req.user.id });

      if (!cart) {
        cart = new Cart({
          shopper: req.user.id,
          products: [],
          total : 0
        });
        return res.json(cart);
      }
      let populatedProducts = await Cart.populate(cart, { path: 'products.product' });
      
      let totalPrice = 0;
      for (let populatedProduct of populatedProducts.products) {
        let productPrice = populatedProduct.product.price;
        totalPrice += productPrice * populatedProduct.quantity;
      }
  
      // Update the total price in the cart
      cart.total = totalPrice;

    return res.json(cart);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;

      // Retrieve the product by ID
      const product = await Product.findById(productId);
      const lootQuantity = product.quantity;

      if (quantity > lootQuantity){
        return res.json({ msg: 'We do not have that many, Adventurer. Check back later...'});
      }

      if (!product) {
        return res.status(404).json({ msg: 'Loot missing...' });
      }

      // Retrieve the cart for the shopper
      let cart = await Cart.findOne({ shopper: req.user.id });
      // If cart doesn't exist, create a new cart
      if (!cart) {
        cart = new Cart({
          shopper: req.user.id,
          products: [],
        });
      }

      // Check if the product already exists in the cart
      const existingProduct = cart.products.find((p) => p.product.equals(productId));
      

      if (existingProduct) {
        // Update the quantity if the product already exists in the cart
        existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(quantity);

      } else {
        // Add the product to the cart if it doesn't exist
        cart.products.push({
          product: product,
          quantity
        });
      }
      let totalPrice = 0;
      const cartProducts = [];


      for (const cProduct of cart.products) {
        const loot = await Product.findById(cProduct.product);
        cartProducts.push(loot);
        totalPrice += loot.price * cProduct.quantity;
      }
  
      // Update the total price in the cart
      cart.total = totalPrice;

      // Save the updated cart
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate({
        path: 'products.product',
        model: 'Product'
      });

    res.json(populatedCart);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const productId = req.params.productId;

      // Retrieve the cart for the shopper
      const cart = await Cart.findOne({ shopper: req.user.id });

      if (!cart) {
        cart = new Cart({
          shopper: req.user.id,
          products: []
        });
      }

      // Find the product in the cart by product ID
      const productIndex = cart.products.findIndex((products) => products.product.equals(productId));

      if (productIndex === -1) {
        return res.status(404).json({ msg: 'Loot not found in cart' });
      }

      // Remove the product from the cart
      cart.products.splice(productIndex, 1);

      // Save the updated cart
      await cart.save();

      res.json({ msg: 'Loot removed from cart' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateQuantity: async (req, res) => {
    try {
      const productId = req.params.productId;
      const { quantity } = req.body;
      // Retrieve the cart for the shopper
      const cart = await Cart.findOne({ shopper: req.user.id });
      if (!cart) {
        return res.status(404).json({ msg: 'Cart not found' });
      }
      
      // Find the product in the cart by product ID
      const product = cart.products.find((products) => products.product.equals(req.params.productId));
      
      if (!product) {
        return res.status(404).json({ msg: 'Loot not found in cart' });
      }
      
      // Find the index of the product in the cart
      const productIndex = cart.products.findIndex(
        (product) => product.product.toString() === productId
        );
        
        // Check if the product is in the cart
        if (productIndex === -1) {
          return res.status(404).json({ msg: 'Product not found in the cart' });
        }
        
        // update the quantity of the product 
        cart.products[productIndex].quantity = quantity;

        if (quantity < 1) {
          cart.products.splice(productIndex, 1);
        }
        
        // Recalculate the total price
        let populatedProducts = await Cart.populate(cart, { path: 'products.product' });
        
        let totalPrice = 0;
        for (let populatedProduct of populatedProducts.products) {
          let productPrice = populatedProduct.product.price;
          totalPrice += productPrice * populatedProduct.quantity;
        }
        // Update the total price in the cart
        cart.total = totalPrice;
        
        // Save the updated cart
    await cart.save();

    return res.json(cart);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};


module.exports = cartCtrl;