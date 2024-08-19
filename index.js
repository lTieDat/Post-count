// gán express vào project
const express = require('express');
const app = express();

//gan body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//gan thu vien moment
const moment = require('moment');
app.locals.moment = moment;

//gán thư viện popup thông báo cookie-parser và session cho thu vieen express-flash
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//gan method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//nhung file env
require('dotenv').config();
const port = process.env.PORT ;

//setup database
const database = require('./config/database.js');
database.connect();
//end setup database

app.use(express.static('public'));

//gán view 
app.set('views', './views');
app.set('view engine', 'pug');

//nhúng client index.router.js vào project
const router = require('./routes/index.js');
router(app);

// page 404
// app.get("*",(req,res) =>{
//     res.render("client/pages/error/404.pug",{
//         title: "404 Not Found"
//     });
// });

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})