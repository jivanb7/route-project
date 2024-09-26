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
  console.log(
    "\nATTEMPTING TO DELETE REVIEW IMAGE INSIDE REVIEW IMAGE AUTHORIZATION\n"
  );
  console.log("req.url: ", req.url, "\n");
  console.log("user logged in: ", req.user.id);
  const userId = req.user.id;
  let { imageId } = req.params;

  if (req.url === "/undefined") {
    console.log("\nreq.url was identified as /undefined \n");
    return blockAuthorization(next);
  }

  const reviewImage = await ReviewImage.findOne({
    where: { id: imageId },
    include: [Review],
  });

  if (!reviewImage) {
    return next(reviewImageNotFound);
  }

  // console.log("\n\nuser logged in: ", userId);
  // console.log("user who owns the review: ", reviewImage.Review.userId, "\n\n");

  if (userId !== reviewImage.Review.userId) {
    console.log("\nuser is not permitted to delete this review image\n");
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
    const successMessage = { message: "Successfully deleted" };
    console.log("\nmessage if successful: ", successMessage, "\n");
    return res.status(200).json(successMessage);
  }
);

module.exports = router;
