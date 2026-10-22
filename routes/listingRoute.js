const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// "/" routes combined

router.route("/")
    .get(wrapAsync(listingController.index))
    //new listing saving in DB
    .post(
        isLoggedin,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.newListing)
    );

//new listing form route
router.get("/new",isLoggedin,listingController.newListingform);

// "/;id" routes combined
router.route("/:id")
    //edit in DB route
    .put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))

    //delete a listing route;
    .delete(isLoggedin,isOwner,wrapAsync(listingController.deleteListing))

    //show a clicked listing route
    .get(wrapAsync(listingController.showListing));


//edit route form
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.editform));

module.exports=router;