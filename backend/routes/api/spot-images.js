const express = require("express");

const { requireAuth, blockAuthorization } = require("../../utils/auth");

const { Spot, SpotImage } = require("../../db/models");

const router = express.Router();

// resuable custom error for any spot image that is not found in the database
const spotImageNotFound = new Error("Spot Image couldn't be found");
spotImageNotFound.status = 404;
spotImageNotFound.message = "Spot Image couldn't be found";

// spot image authorization middleware for anywhere a user must own the spot this image belongs to
const spotImageAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  const { imageId } = req.params;

  const spotImage = await SpotImage.findOne({
    where: { id: imageId },
    include: [Spot],
  });

  if (!spotImage) {
    return next(spotImageNotFound);
  }

  if (userId !== spotImage.Spot.ownerId) {
    return blockAuthorization(next);
  }

  next();
};

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
