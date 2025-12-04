const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

// Create a new review
module.exports.createReview = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Cannot find the listing");
        return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created");
    return res.redirect(`/listings/${listing._id}`);
});

// Delete a review
module.exports.destroyReview = wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
   return  res.redirect(`/listings/${id}`);
});
