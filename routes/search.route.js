const homeRouter = require('express');
const router = homeRouter.Router();
const controller = require('../controller/search.controller')
const authMiddleware = require('../middlewares/client/auth.middleware.js');

router.get('/',authMiddleware.requireAuth, controller.index)

module.exports = router;