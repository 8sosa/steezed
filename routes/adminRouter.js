const router = require('express').Router()
const adminCtrl = require('../controllers/adminCtrl')
const auth = require('../middleware/auth')

router.post('/register', adminCtrl.registerAdmin)
router.post('/login', adminCtrl.loginAdmin)
router.get('/verify/a', adminCtrl.verifyAdminToken)

router.route('/')
    .get(auth, adminCtrl.getAdmins)

module.exports = router;