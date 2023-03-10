const router = require('express').Router()
const { validateLogin } = require('../middlewares/validation')
const authController = require('../controllers/loginController')

// UPDATE
router.post('/login', validateLogin, authController.login)

module.exports = router
