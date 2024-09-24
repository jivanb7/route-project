const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, Review } = require("../../db/models");

const router = express.Router();

// get all spots
router.get("/", async (_req, res) => {
  let allSpots = await Spot.findAll({
    include: [SpotImage, Review],
  });

  allSpots = allSpots.map((spot) => {
    spot = spot.toJSON(); // this enables spread this is just a normal POJO
    let sumOfRatings = 0;
    spot.Reviews.forEach((review) => {
      sumOfRatings += review.stars;
    });
    const avgRating = sumOfRatings / spot.Reviews.length;
    const preview = spot.SpotImages.find((spotImage) => {
      return spotImage.preview === true;
    });
    const { Reviews, SpotImages, price, lat, lng, ...spotWithAssociations } =
      spot;

    spotWithAssociations.price = parseInt(price);
    spotWithAssociations.lat = parseInt(lat);
    spotWithAssociations.lng = parseInt(lng);

    if (avgRating) {
      spotWithAssociations.avgRating = avgRating;
    }

    if (preview) {
      spotWithAssociations.previewImage = preview.url;
    }
    return spotWithAssociations;
  });
  res.status(200).json({ Spots: allSpots });
});

module.exports = router;
