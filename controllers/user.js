const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

// Render signup form
module.exports.renderSignupForm = (req, res) => {
   return res.render("users/signup.ejs");
};

// Handle signup
module.exports.signup = wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // Automatically log in the user after signup
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to WanderOn!");
       return  res.redirect("/listings");
    });
});

// Render login form
module.exports.renderLoginForm = (req, res) => {
   return  res.render("users/login.ejs");
};

// Handle login
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WanderOn!");
    const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo; // Clear it after redirect
    return res.redirect(redirectUrl);
};

// Handle logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
       return  res.redirect("/listings");
    });
};
