const User = require('../models/user.model');

//[GET] /user/login
module.exports.login = async(req,res) =>{
    res.render('pages/user/login',{
        pageTitle: "Đăng nhập"
    });
}

//[POST] /user/login
module.exports.loginPost = async(req,res) =>{
    const email = req.body.email;   
    const password = req.body.password; 
    const user = await User.findOne({
        email: email
    });
    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if(user.password !== password){
        req.flash("error", "Mật khẩu không đúng");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser",user.token);
    res.redirect("/");
}

//[GET] /user/logout
module.exports.logout = async(req,res) =>{
    res.clearCookie("tokenUser");
    res.redirect("/");
}
