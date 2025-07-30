const { Router } = require('express')
const router = Router()

const { 
    ctrlLogin,
    ctrlLoginWithGoogle,
    ctrlRegister,
    ctrlEmailVeify,
    ctrlChangePassword
} = require('../controllers/user.controller')

const auth = require('../middlewares/auth')

router.post('/v1/api_register',ctrlRegister)

router.post('/v1/api_login',ctrlLogin)

router.post('/v1/api_googleSignup',ctrlLoginWithGoogle)

router.post('/v1/api_email_verify',ctrlEmailVeify)

router.post('/v1/api_verify_email', ctrlEmailVeify)

router.post('/v1/api_change_password', auth, ctrlChangePassword)
module.exports = router