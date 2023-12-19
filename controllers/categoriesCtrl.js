const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
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

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.json(category);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      // Check if the category already exists
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return res.status(400).json({ msg: 'Category already exists' });
      }

      // Create a new category
      upload(req, res, async (err) => {
        if (err) {
          return res.json(err)
        } else {
          const newCategory = new Category({
            name: req.body.name,
            image: {
              data: req.file.filename,
              contentType: 'image/png'
            },
            imageName: req.file.filename
          });
    
          // Save the new category to the database
          await newCategory.save();
    
          res.json({ msg: 'Category created successfully' });
        }
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;

      // Find the category by ID
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }

      // Update the category's name
      category.name = name;

      // Save the updated category to the database
      await category.save();

      res.json({ msg: 'Category updated successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: 'Category deleted successfully' });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getCategoryProducts: async (req, res) =>{
    try {
        const CategoryProducts = await Product.find({category: req.params.id})
        res.json(CategoryProducts)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}
};

module.exports = categoryCtrl;