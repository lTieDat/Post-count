const searchRouter = require('./search.route.js');
const userRouter = require('./user.route.js');


const router = (app) =>{
    app.use('/', searchRouter);
    app.use('/user', userRouter);
}

module.exports = router;