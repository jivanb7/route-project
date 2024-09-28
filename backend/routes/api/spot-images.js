const express = require("express");

const { requireAuth, spotImageAuthorization } = require("../../utils/auth");

const { SpotImage } = require("../../db/models");

const router = express.Router();

// delete an existing image for a spot
router.delete(
  "/:imageId",
  requireAuth,
  spotImageAuthorization,
  async (req, res) => {
    const { imageId } = req.params;

    await SpotImage.destroy({
      where: { id: imageId },
    });

    res.status(200).json({ message: "Successfully deleted" });
  }
);

module.exports = router;
