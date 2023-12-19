const router = require('express').Router()
const sellerCtrl = require('../controllers/sellerCtrl')
const auth = require('../middleware/auth')

router.post('/register', sellerCtrl.registerSeller)

router.post('/login', sellerCtrl.loginSeller)

router.put('/:sellerId/orders/:orderId', sellerCtrl.processOrder)

router.route('/')
        .get(sellerCtrl.getSellers)

router.route('/:id')
        .get(sellerCtrl.getSeller)
        .put(auth, sellerCtrl.updateSeller)
        .delete(auth, sellerCtrl.deleteSeller)

router.route('/:id/products')
    .get(sellerCtrl.getProductsBySeller)

router.get('/verify/m', sellerCtrl.verifySellerToken)

module.exports = router