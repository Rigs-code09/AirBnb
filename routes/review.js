const express = require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,validateReview,isAuthor}=require("../middleware.js");

const reviewcontroller=require("../controllers/review.js");

//Review Route
router.post("/",isLoggedIn , validateReview, 
    wrapAsync(reviewcontroller.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isAuthor,
    wrapAsync(reviewcontroller.deleteReview));

module.exports=router;