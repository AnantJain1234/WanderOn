const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");

// Show all listings
module.exports.index = wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
   return  res.render("listings/index.ejs", { allListings });
});

// Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
   return  res.render("listings/new.ejs");
};

// Show a single listing
module.exports.showListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

   return  res.render("listings/show.ejs", { listing });
});

// Create a new listing
module.exports.createListing = wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", "New Listing Created");
   return  res.redirect("/listings");
});

// Render edit form for a listing
module.exports.renderEditForm = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image?.url;
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload/h_300,w_250", "");
    }

   return  res.render("listings/edit.ejs", { listing, originalImageUrl });
});

// Update a listing
module.exports.updateListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await listing.save();
    }

    req.flash("success", "Listing updated");
    return res.redirect(`/listings/${id}`);
});

// Delete a listing
module.exports.destroyListing = wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
   return  res.redirect("/listings");
});
