const router = require('express').Router()
const auth = require('../middleware/auth')
const checkoutCtrl = require('../controllers/checkoutCtrl')

router.route('/')
        .post(auth, checkoutCtrl.createPaymentIntent)

router.route('/:orderid')
        .get(auth, checkoutCtrl.verifyPayment)

router.route('/cancel')
        .get(auth, checkoutCtrl.paymentCancel)

        

module.exports = router