const router = require('express').Router()
const auth = require('../middleware/auth')
const wishlistCtrl = require('../controllers/wishlistCtrl')

router.route('/')        
    .get(auth, wishlistCtrl.getWishlist)
    .post(auth, wishlistCtrl.addToWishlist);
        
router.route('/:product_id')
    .delete(auth, wishlistCtrl.removeFromWishlist);
        
module.exports = router;