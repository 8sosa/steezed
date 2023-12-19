const router = require('express').Router()
const auth = require('../middleware/auth')
const orderCtrl = require('../controllers/orderCtrl')

router.route('/')
        .get(auth, orderCtrl.getOrders)
        .post(auth, orderCtrl.createOrder)

router.route('/:id')
        .get(auth, orderCtrl.getOrder)
        .put(auth, orderCtrl.processOrder)

router.route('/pending/:id')
        .put(auth, orderCtrl.pendOrder)

router.route('/cancel/:id')
        .put(auth, orderCtrl.cancelOrder)

router.route('/deliver/:id')
        .put(auth, orderCtrl.deliverOrder)

router.route('/ship/:id')
        .put(auth, orderCtrl.shipOrder)

module.exports = router