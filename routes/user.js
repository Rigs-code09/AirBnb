const express = require("express");
const router=express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");

const usercontroller=require("../controllers/user.js");

router.route("/signup" )
//signup form
.get(usercontroller.renderSignupForm)
//signing up
.post(wrapAsync(usercontroller.signup));

router.route("/login")
//login form
.get(usercontroller.renderLoginForm)
//logging in
.post(saveRedirectUrl, passport.authenticate("local" , 
    {failureRedirect: '/login',failureFlash: true }),
    usercontroller.login
);

router.get("/logout",usercontroller.logout);

module.exports=router;