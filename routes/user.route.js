const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../controller/user.controller')
const userValidate = require('../validate/client/user.validate')

router.get('/login', controller.login)
router.post('/login', userValidate.loginPost, controller.loginPost)
router.get('/logout', controller.logout);

module.exports = router;