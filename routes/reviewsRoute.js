const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validatereview, isLoggedin, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js"); 

//posting a review on page
router.post("/",isLoggedin,validatereview,wrapAsync(reviewController.addReview)
);

//review delete form everywhere route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.deleteReview)
);

module.exports=router;