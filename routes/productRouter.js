const router = require('express').Router()
const auth = require('../middleware/auth')
const productCtrl = require('../controllers/productCtrl')

router.route('/')
    .get(productCtrl.getProducts)

router.route('/:id')
    .get(productCtrl.getProductById)
    .put(auth, productCtrl.updateProduct)
    .delete(auth, productCtrl.deleteProduct)

router.post('/image', auth, productCtrl.addProduct)

router.get(productCtrl.getProductImage)
    

module.exports = router