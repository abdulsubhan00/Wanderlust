if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js");
const db_url = process.env.ATLAS_URL;


const listingRouter = require("./routes/listingRoute.js");
const reviewRouter=require("./routes/reviewsRoute.js");
const userRouter=require("./routes/userRoute.js");

async function main(){
    await mongoose.connect(db_url);
}

main().then((res)=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("unable to connect with DB");
});

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

//session store on cloud
const store = MongoStore.create({
    mongoUrl : db_url,

    crypto:{
        secret : process.env.SECRET,
    },

    touchAfter : 24*3600,
});

store.on("error",()=>{
    console.log("Error i mongo session store");
});

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly:true
    },
}
app.use(session(sessionoptions));

app.use(flash());

//passport implementation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local vbl sharing middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Routers
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {statuscode=500,message="something went wromg"} = err;
    res.status(statuscode).render("error.ejs",{message});
})

let port=8080;
app.listen(port,()=>{
    console.log(`Server has started at ${port}`);
})