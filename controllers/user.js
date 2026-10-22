const User = require("../models/user.js");

module.exports.signupForm = async(req,res)=>{
    res.render("Users/signup.ejs");
};

module.exports.signupSave = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        //inbuilt passport functionality for automatics login after signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Weloce onBoard !!");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
};

module.exports.loginForm = (req,res)=>{
    res.render("Users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome Back User");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been Logged out successfully");
        res.redirect("/listings");
    })
}