const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require ("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


const listingContoller = require("../controllers/listings.js");



const validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


router.route("")
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingContoller.createListing));



// New Route
router.get("/new",isLoggedIn,listingContoller.renderNewForm);
// Here if we put this New Route after the Show Route, we got a error which occurs because when New Route is placed after Show Route express router get consfused in "/listings/:id" & "/listings/new" it consider the new as id
 

router.route("/:id")
.get(wrapAsync(listingContoller.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync( listingContoller.updateListing));


router.route("/:id/delete")
.get(isLoggedIn,isOwner,wrapAsync(listingContoller.deleteListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,
wrapAsync( listingContoller.editListing));

// Bookings Route 
router.post("/:id/book",isLoggedIn,
wrapAsync(listingContoller.bookListing));

module.exports = router;