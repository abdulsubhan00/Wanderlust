const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReview = async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","Review added successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
}