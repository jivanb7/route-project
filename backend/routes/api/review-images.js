const express = require("express");

const { requireAuth, reviewImageAuthorization } = require("../../utils/auth");

const { ReviewImage } = require("../../db/models");

const router = express.Router();

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
