const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');

const wishlistCtrl = {
  getWishlist: async (req, res) => {
    try {
      // Retrieve the wishlist for the user
      let wishlist = await Wishlist.findOne({ shopper: req.user.id });
  
      if (!wishlist) {
        wishlist = new Wishlist({
          shopper: req.user.id,
          products: [],
        });
      }
  
      // Populate the 'product' field within each 'wishlistProductSchema' object
      const populatedProducts = await Wishlist.populate(wishlist, { path: 'products.product' });

      // const populatedProducts = await Wishlist.populate(wishlist, { path: 'products.product' });
  
      // Replace the original 'products' array with the populated products
      // wishlist.products = populatedProducts;
  
      res.json(wishlist);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  addToWishlist: async (req, res) => {
    try {
      const { product_id } = req.body;
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({ msg: 'Loot missing...' });
      }
      
      let wishlist = await Wishlist.findOne({ shopper: req.user.id });
      if (!wishlist) {
      wishlist = new Wishlist({
        shopper: req.user.id,
        products: [],
      });
      }
      const existingProduct = wishlist.products.find((product) => product.product.equals(product_id));  
      if (existingProduct) {
        return res.status(400).json({ msg: 'Product already exists in wishlist' });
      } 
      else {
        wishlist.products.push({product: product_id});
      }
  
      await wishlist.save();
  
      res.json({ msg: 'Added to wishlist'});
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  removeFromWishlist: async (req, res) => {
    try {
      const { product_id } = req.params;

      // Retrieve the wishlist for the user
      let wishlist = await Wishlist.findOne({ shopper: req.user.id });
      if (!wishlist) {
        wishlist = new Wishlist({
          shopper: req.user.id,
          products: [],
        });
      }

      // Find the product in the wishlist by product ID
      const productIndex = wishlist.products.findIndex((product) => product.equals(product_id));

      if (productIndex === -1) {
        return res.status(404).json({ msg: 'Loot not found in wishlist' });
      }

      // Remove the product from the wishlist (still review)
      wishlist.products.splice(productIndex, 1);

      // Save the updated wishlist
      await wishlist.save();

      res.json({ msg: 'Loot removed from wishlist' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = wishlistCtrl;