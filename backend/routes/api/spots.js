const express = require("express");

const { requireAuth } = require("../../utils/auth");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { Spot, SpotImage, Review, User } = require("../../db/models");

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

// get details of a spot from an id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({
    include: [
      { model: SpotImage, attributes: ["id", "url", "preview"] },
      Review,
      { model: User, attributes: ["id", "firstName", "lastName"] },
    ],
    where: {
      id: spotId,
    },
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  const spotImages = spot.SpotImages;
  const numReviews = spot.Reviews.length;
  const spotOwner = spot.User;

  const formattedSpot = {
    ...formatSpots([spot])[0],
    numReviews,
    SpotImages: spotImages,
    Owner: spotOwner,
  };

  delete formattedSpot.User;

  res.status(200).json(formattedSpot);
});

// validations for new spot information

const validateNewSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isInt({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isInt({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 49 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

// create a new spot
router.post("/", requireAuth, validateNewSpot, async (req, res) => {
  const spotDetails = {
    ownerId: req.user.id,
    ...req.body,
  };

  const newSpot = await Spot.create(spotDetails);

  res.status(201).json(newSpot);
});

module.exports = router;
