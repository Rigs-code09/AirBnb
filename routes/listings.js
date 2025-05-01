const express = require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,
    validateListing}=require("../middleware.js");

const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
//IndexRoute
.get(wrapAsync(listingcontroller.index))
//Create Route
.post(isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingcontroller.createListings));

//New route
router.get("/new",isLoggedIn,listingcontroller.renderNewForm);

router.route("/:id")
//Show route
.get(wrapAsync(listingcontroller.showListings))
//Update Route
.put(isLoggedIn,isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingcontroller.updateListings))
//Delete Route
.delete(isLoggedIn,isOwner,
    wrapAsync(listingcontroller.deleteListing));


//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,
    wrapAsync(listingcontroller.renderEditForm));

module.exports=router;