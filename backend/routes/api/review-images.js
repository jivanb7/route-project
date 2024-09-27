const express = require("express");

const { requireAuth, blockAuthorization } = require("../../utils/auth");

const { Review, ReviewImage } = require("../../db/models");

const router = express.Router();

// resuable custom error for any review image that is not found in the database
const reviewImageNotFound = new Error("Review Image couldn't be found");
reviewImageNotFound.status = 404;
reviewImageNotFound.message = "Review Image couldn't be found";

// review image authorization middleware for anywhere a user must own the review this image belongs to
const reviewImageAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  let { imageId } = req.params;

  if (req.url === "/undefined") {
    return blockAuthorization(next);
  }

  const reviewImage = await ReviewImage.findOne({
    where: { id: imageId },
    include: [Review],
  });

  if (!reviewImage) {
    return next(reviewImageNotFound);
  }

  if (userId !== reviewImage.Review.userId) {
    return blockAuthorization(next);
  }

  next();
};

// delete an existing image for a review at route: /api/review-images/:imageId
router.delete(
  "/:imageId",
  requireAuth,
  reviewImageAuthorization,
  async (req, res) => {
    let { imageId } = req.params;

    await ReviewImage.destroy({
      where: { id: imageId },
    });

    return res.status(200).json({ message: "Successfully deleted" });
  }
);

module.exports = router;
