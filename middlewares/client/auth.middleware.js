const User = require("../../models/user.model.js");
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        res.redirect("/user/login");
        return;
    }
    const user = await User.findOne({
        tokenUser: req.cookies.token
    }).select("-password");
    if (!user) {
        res.redirect("/user/login");
        return;
    } else {
        res.locals.user = user;
        next();
    }
}
