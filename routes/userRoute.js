const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//both signup route combined
router.route("/signup")
    //get signup request redirects user to signup form
    .get(userController.signupForm)

    //post signup request is used to save user in DB
    .post(wrapAsync(userController.signupSave))

//both login route combined
router.route("/login")
    //get login route redirects to login form
    .get(userController.loginForm)

    //post login request checks credentials in DB    
    .post(saveRedirectUrl,
        passport.authenticate("local",{failureRedirect : "/login" ,failureFlash : true}),
        userController.login
    );

//logout route using passport
router.get("/logout",userController.logout);

module.exports=router;