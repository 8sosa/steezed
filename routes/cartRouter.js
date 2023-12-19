const router = require('express').Router()
const auth = require('../middleware/auth')
const cartCtrl = require('../controllers/cartCtrl')

router.route('/')        
    .get(auth, cartCtrl.getCart)
    
    router.route('/:productId')
    .post(auth, cartCtrl.addToCart)
    .delete(auth, cartCtrl.removeFromCart)
    .put(auth, cartCtrl.updateQuantity)
        
module.exports = router;