const express = require("express");
const { requireAuth, reviewAuthorization } = require("../../utils/auth");

const { validateReviewDetails } = require("../../utils/validation.js");
const { formatReview } = require("../../utils/recordFormatters.js");

const {
  Review,
  Spot,
  ReviewImage,
  SpotImage,
  User,
} = require("../../db/models");

const router = express.Router();

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
        attributes: { exclude: ["createdAt", "updatedAt", "description"] },
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
      { model: User, attributes: ["id", "firstName", "lastName"] },
    ],
  });

  const reviewsArray = allReviewsByUser.map((reviewObj) => {
    return formatReview(reviewObj);
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
    stars = Number(stars);

    const reviewInstance = await Review.findByPk(reviewId);

    const currentTimeStamp = new Date();
    reviewInstance.set({
      review,
      stars,
      updatedAt: currentTimeStamp,
    });

    await reviewInstance.save();
    const updatedReview = await reviewInstance.reload();

    const formattedReview = formatReview(updatedReview);

    res.status(200).json(formattedReview);
  }
);

// delete a review by reviewId
router.delete(
  "/:reviewId",
  requireAuth,
  reviewAuthorization,
  async (req, res) => {
    const { reviewId } = req.params;

    await Review.destroy({
      where: {
        id: reviewId,
      },
    });

    res.status(200).json({ message: "Successfully deleted" });
  }
);

module.exports = router;
