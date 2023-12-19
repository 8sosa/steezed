const router = require('express').Router()
const shopperCtrl = require('../controllers/shopperCtrl')
const auth = require('../middleware/auth')

router.post('/register', shopperCtrl.registerShopper)

router.post('/login', shopperCtrl.loginShopper)

router.route('/')
        .get(auth, shopperCtrl.getShoppers)

router.route('/:id')
        .get(auth, shopperCtrl.getShopper)
        .put(auth, shopperCtrl.updateShopper)
        .delete(auth, shopperCtrl.deleteShopper)

router.get('/verify/a', shopperCtrl.verifyShopperToken)

module.exports = router