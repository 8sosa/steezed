const Seller = require('../models/sellerModel')
const Product = require('../models/productModel')
const Orders = require('../models/orderModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const sellerCtrl = {
  getSellers: async (req, res) => {
    try {
      const sellers = await Seller.find();
      res.json(sellers);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getSeller: async (req, res) => {
    try {
      const seller = await Seller.findById(req.params.id);
      res.json(seller);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  registerSeller: async (req, res) => {
    try {
      const {userName, shopDescription, email, password, phoneNumber, shopName, shopAddress} = req.body;

      // Check if the email already exists
      const existingSeller = await Seller.findOne({ email });
      if (existingSeller) {
        return res.status(400).json({ msg: 'Email already in use, another Merchant beat you to it it seems...' });
      }

      const existingShop = await Seller.findOne({ shopName });
      if (existingShop) {
        return res.status(400).json({ msg: 'Shop name already in use, another Merchant beat you to it it seems...' });
      }
    
      // register a new shopper
      const passwordHash = await bcrypt.hash(password, 15)
      const newSeller = new Seller({
        userName: userName,
        email: email,
        password: passwordHash,
        phoneNumber: phoneNumber, 
        shopName: shopName,
        shopDescription: shopDescription,
        shopAddress: shopAddress
      });

      // Save the new shopper to the database
      await newSeller.save();

      res.json({ msg:  `Welcome to the alliance Merchant ${newSeller.userName}, happy conning...` });        
      } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  
  processOrder: async (req, res) => {
    const { sellerId, orderId } = req.params;
    const { newStatus } = req.body;
  
    try {
      // Find the seller by ID
      const seller = await Seller.findById(sellerId);
      
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      
      const orderIndex = seller.orders.findIndex((order) => order.orderId.equals(orderId));
      
      if (orderIndex !== -1) {
        // Update the status on the seller side
        seller.orders[orderIndex].status = newStatus;
        
        // Save the seller
        const updatedSeller = await seller.save();
        
        // Now, manually trigger the middleware for the Order model
        const order = await Orders.findById(orderId);
        if (order) {
          order.products[0].status = newStatus;
          await order.save();
          return res.json({ seller: updatedSeller, order });
        } else {
          return res.status(404).json({ error: 'Order not found in the seller\'s orders' });
        }
      } else {
        return res.status(404).json({ error: 'Order not found in the seller\'s orders' });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateSeller: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.json(err);
        } else {
          const { shopName, shopDescription, userName, email, password, phoneNumber, shopAddress } = req.body;
          const sellerId = req.params.id; // Assuming you pass the seller's ID in the URL parameters
  
          // Check if the seller with the given ID exists
          const existingSeller = await Seller.findById(sellerId);
  
          if (!existingSeller) {
            return res.status(404).json({ msg: 'seller not found.' });
          }

          // Update seller details
          existingSeller.shopName = shopName;
          existingSeller.shopDescription = shopDescription;
          existingSeller.userName = userName;
          existingSeller.email = email;
          existingSeller.phoneNumber = phoneNumber;
          existingSeller.shopAddress = shopAddress;
  
          // Check if the password is provided and update it if necessary
          if (password) {
            const passwordHash = await bcrypt.hash(password, 15);
            existingSeller.password = password || passwordHash;
          }
  
          // Check if an image is uploaded and update it if necessary
          if (req.file) {
            existingSeller.image = {
              data: req.file.filename,
              contentType: 'image/png'
            };
            existingSeller.imageName = imageName || req.file.filename;
          }
  
          // Save the updated seller to the database
          await existingSeller.save();
  
          res.json(existingSeller);
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteSeller: async (req, res) => {
    try {
      console.log('Token in Controller:', req.header('Authorization'));
      await Seller.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Merchant deleted successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  loginSeller: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if the seller exists
      const seller = await Seller.findOne({ email: email });
      if (!seller) {
        return res.status(400).json({ msg: 'Merchant does not exist...' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, seller.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Incorrect password, is it really you?' });
      }

      // Generate a JWT token
      const payload = {id: seller.id, name: seller.userName}
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" });

      return res.json({
        Token: token,
        seller: {
          id: seller.id,
          name: seller.userName,
          email: seller.email,
        },
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getProductsBySeller: async (req, res) => {
    try {
      const products = await Product.find({ seller: req.params.id });
      res.json(products);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  verifySellerToken: async (req, res) => {
    try {
      // Extract the token from the request headers
      const token = req.header('Authorization');

       // Check if the token is extracted
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      // Verify the token
      jwt.verify(token, process.env.TOKEN_SECRET, async (err, verified) => {
        if (err) {
          return res.status(401).json({ msg: 'Token is not valid' });
        }

        // if token is valid
        const seller = await Seller.findById(verified.id)
        
        // check if seller exists
        if(!seller) {
            return res.status(403).json({msg: 'Unauthorized access'})
        }
        return res.json({ id: seller.id, username: seller.userName });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = sellerCtrl;
