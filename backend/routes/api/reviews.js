const express = require("express");
const { requireAuth, blockAuthorization } = require("../../utils/auth");

const { validateReviewDetails } = require("./spots.js");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Review, Spot, ReviewImage, SpotImage } = require("../../db/models");

const router = express.Router();

const reviewNotFoundError = new Error(
  "Couldn't find a Review with the specified id"
);
reviewNotFoundError.status = 404;
reviewNotFoundError.message = "Review couldn't be found";

const reviewAuthorization = async (req, _res, next) => {
  const userId = req.user.id;

  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    return next(reviewNotFoundError);
  }

  if (userId !== review.userId) {
    return blockAuthorization(next);
  }

  next();
};

// get all reviews written by the current user
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const allReviewsByUser = await Review.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Spot,
        include: [{ model: SpotImage, attributes: ["preview", "url"] }],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  const reviewsArray = allReviewsByUser.map((reviewObj) => {
    reviewObj = reviewObj.toJSON();

    const User = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    };

    reviewObj.User = User;

    const previewImg = reviewObj.Spot.SpotImages.find(
      (spotImage) => spotImage.preview
    );
    if (previewImg) {
      reviewObj.Spot.previewImage = previewImg.url;
    }

    delete reviewObj.Spot.SpotImages;

    return reviewObj;
  });

  res.status(200).json({ Reviews: reviewsArray });
});

// create new image for a review specified by reviewId
router.post(
  "/:reviewId/images",
  requireAuth,
  reviewAuthorization,
  async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findOne({
      where: {
        id: reviewId,
      },
      include: [{ model: ReviewImage }],
    });

    if (review.ReviewImages.length === 10) {
      const err = new Error(
        "Cannot add any more images because there is a maximum of 10 images per resource"
      );
      err.status = 403;
      err.message = "Maximum number of images for this resource was reached";
      return next(err);
    }

    let newReviewImage = await ReviewImage.create({
      ...req.body,
      reviewId,
    });

    newReviewImage = newReviewImage.toJSON();

    res.status(201).json({
      id: newReviewImage.id,
      url: newReviewImage.url,
    });
  }
);

// edit a review by reviewId
router.put(
  "/:reviewId",
  requireAuth,
  reviewAuthorization,
  validateReviewDetails,
  async (req, res) => {
    const { reviewId } = req.params;
    let { review, stars } = req.body;
    stars = parseInt(stars);
    // query for the review that we know exists and we know user has authorization to edit
    const reviewInstance = await Review.findByPk(reviewId);
    // generate a current timestamp to update the updatedAt property of the Review instance
    const currentTimeStamp = new Date();
    // run .set() on the returned Review instance to update all properties from req.body
    reviewInstance.set({
      review,
      stars,
      updatedAt: currentTimeStamp,
    });
    // run .save() on the returned Review instance to save the updated version back to the db
    await reviewInstance.save();
    // run .reload() to get the updated instance from the db
    const reviewToDisplay = await reviewInstance.reload();
    // return everything from the updated Review instance with status code 200
    res.status(200).json(reviewToDisplay);
  }
);

module.exports = router;
