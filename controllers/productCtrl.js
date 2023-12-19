const Product = require('../models/productModel');
const multer  = require('multer')

const Storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./Images")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage: Storage}).single('file')

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.json(product);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addProduct: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.json(err)
      } else {
        const newProduct = new Product({
          productName: req.body.productName, 
          image: {
            data: req.file.filename,
            contentType: 'image/png'
          },
          imageName: req.file.filename,
          description: req.body.description, 
          price: req.body.price, 
          quantity: req.body.quantity,
          category: req.body.category,
          seller: req.user.id
        });
  
        // Save the product to the database
        await newProduct.save();
  
        res.json({ msg: 'Loot created' });
      }
    });
  },
  getProductImage: async (req, res) => {
    try {
      Images.find({}).then(data => {
        res.json(data)
      }).catch(error => {
        res.status(408).json({ error })
      })
    } catch (error){
      res.json({error})
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { productName, image, description, price, quantity, category } = req.body;

      // Find the product by ID and update its fields
      await Product.findByIdAndUpdate(req.params.id, {
        productName, 
        image: {
          data: req.file.filename,
          contentType: 'image/png'
        },
        description, 
        price, 
        quantity, 
        category
      });

      res.json({ msg: 'Loot updated' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      // delete images on the public server too?
      res.json({ msg: 'Loot deleted' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = productCtrl;