const express = require("express");

const { requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, Review } = require("../../db/models");

const router = express.Router();

const averageSpotRatings = (spotReviews) => {
  let sumOfRatings = 0;
  spotReviews.forEach((review) => {
    sumOfRatings += review.stars;
  });
  return sumOfRatings / spotReviews.length;
};

const findSpotPreviewImage = (spot) => {
  return spot.SpotImages.find((spotImage) => {
    return spotImage.preview === true;
  });
};

const formatSpots = (spotsArray) => {
  return spotsArray.map((spot) => {
    spot = spot.toJSON(); // convert to POJO

    const avgRating = averageSpotRatings(spot.Reviews);
    const preview = findSpotPreviewImage(spot);

    const { Reviews, SpotImages, price, lat, lng, ...spotWithAggregates } =
      spot;

    spotWithAggregates.price = parseInt(price);
    spotWithAggregates.lat = parseInt(lat);
    spotWithAggregates.lng = parseInt(lng);

    if (avgRating) {
      spotWithAggregates.avgRating = avgRating;
    }

    if (preview) {
      spotWithAggregates.previewImage = preview.url;
    }
    return spotWithAggregates;
  });
};

// get all spots
router.get("/", async (_req, res) => {
  let allSpots = await Spot.findAll({
    include: [SpotImage, Review],
  });

  res.status(200).json({ Spots: formatSpots(allSpots) });
});

// get all spots by current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const allSpotsByUser = await Spot.findAll({
    include: [SpotImage, Review],
    where: {
      ownerId: user.id,
    },
  });

  res.status(200).json({ Spots: formatSpots(allSpotsByUser) });
});

module.exports = router;
