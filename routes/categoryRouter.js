const router = require('express').Router()
const auth = require('../middleware/auth')
const categoryCtrl = require('../controllers/categoriesCtrl')

router.route('/')
        .get(categoryCtrl.getCategories)

router.route('/:id')
        .get(categoryCtrl.getCategory)
        .put(auth, categoryCtrl.updateCategory)
        .delete(auth, categoryCtrl.deleteCategory)

router.route('/:id/products')
        .get(categoryCtrl.getCategoryProducts)

router.post('/image', auth, categoryCtrl.createCategory)

module.exports = router