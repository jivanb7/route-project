const express = require("express");
const { requireAuth, blockAuthorization } = require("../../utils/auth");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Review, Spot, ReviewImage, SpotImage } = require("../../db/models");

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

module.exports = router;
