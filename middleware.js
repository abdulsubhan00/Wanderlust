const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema,listingSchema}=require("./schema.js");


module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You are not logged in !!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        //storing user info to of an unlogged user to redirect him to the page which he wanted to visit before logging in
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//mw to check if the logged user is the owner of listing to make changes
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    const currlisting = await Listing.findById(id);
    if(!currlisting.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized for making changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}


module.exports.validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

//mw to check if the logged user is the owner of review to delete it
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    const currReview = await Review.findById(reviewId);
    if(!currReview.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized for making changes in this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
