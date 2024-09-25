const express = require("express");

const { requireAuth, blockAuthorization } = require("../../utils/auth");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
  Spot,
  SpotImage,
  Review,
  User,
  ReviewImage,
} = require("../../db/models");

const router = express.Router();

// resuable custom error for any spot that is not found in the database
const spotDoesNotExistError = new Error("Spot couldn't be found");
spotDoesNotExistError.status = 404;
spotDoesNotExistError.message = "Spot couldn't be found";

// spot authorization middleware for anywhere a user must own the spot
const spotAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return next(spotDoesNotExistError);
  }

  if (userId !== spot.ownerId) {
    return blockAuthorization(next);
  }

  next();
};

// validations for any spot details passed into the req.body
const validateSpotDetails = [
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
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
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

const validateReviewDetails = [
  check("review")
    .exists({ checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const getAverageRating = (spotReviews) => {
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

    const avgRating = getAverageRating(spot.Reviews);
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
    return next(spotDoesNotExistError);
  }

  const spotAsPojo = spot.toJSON();

  const numReviews = spotAsPojo.Reviews.length;
  const spotOwner = spotAsPojo.User;
  const avgStarRating = getAverageRating(spot.Reviews);

  const spotToReturn = {
    ...spotAsPojo,
    Owner: spotOwner,
    numReviews,
    avgStarRating,
  };

  delete spotToReturn.User;
  delete spotToReturn.Reviews;

  res.status(200).json(spotToReturn);
});

// create a new spot
router.post("/", requireAuth, validateSpotDetails, async (req, res) => {
  const spotDetails = {
    ownerId: req.user.id,
    ...req.body,
  };

  const newSpot = await Spot.create(spotDetails);

  res.status(201).json(newSpot);
});

// add an image to a spot by spot id
router.post(
  "/:spotId/images",
  requireAuth,
  spotAuthorization,
  async (req, res, next) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    const newImageForSpot = await SpotImage.create({
      ...req.body,
      spotId: spot.id,
    });

    const imageDataPojo = newImageForSpot.toJSON();
    const {
      createdAt,
      updatedAt,
      spotId: idOfSpot,
      ...remainingProperties
    } = imageDataPojo;

    res.status(201).json(remainingProperties);
  }
);

// edit a spot by id
router.put(
  "/:spotId",
  requireAuth,
  spotAuthorization,
  validateSpotDetails,
  async (req, res, next) => {
    const { spotId } = req.params;
    const spotToEdit = await Spot.findByPk(spotId);

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    const currentTimeStamp = new Date();

    spotToEdit.set({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
      updatedAt: currentTimeStamp,
    });

    await spotToEdit.save();
    const updatedSpot = await spotToEdit.reload();
    res.status(200).json(updatedSpot);
  }
);

// delete a spot by id
router.delete("/:spotId", requireAuth, spotAuthorization, async (req, res) => {
  const { spotId } = req.params;
  await Spot.destroy({
    where: {
      id: spotId,
    },
  });
  res.status(200).json({ message: "Successfully deleted" });
});

// get all reviews of a spot by spotId
router.get("/:spotId/reviews", async (req, res, next) => {
  const { spotId } = req.params;

  const spot = await Spot.findOne({
    include: [
      {
        model: Review,
        include: [
          { model: ReviewImage, attributes: ["id", "url"] },
          { model: User, attributes: ["id", "firstName", "lastName"] },
        ],
      },
    ],
    where: {
      id: spotId,
    },
  });

  if (!spot) {
    return next(spotDoesNotExistError);
  }

  res.status(200).json({ Reviews: spot.Reviews });
});

// create a review for a spot based on spotId
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReviewDetails,
  async (req, res, next) => {
    const userId = req.user.id;
    let { spotId } = req.params;
    const spot = await Spot.findOne({
      where: { id: spotId },
      include: { model: Review, where: { userId }, required: false },
    });

    if (!spot) {
      return next(spotDoesNotExistError);
    }

    if (spot.Reviews.length > 0) {
      const err = new Error("User already has a review for this spot");
      err.message = "User already has a review for this spot";
      return next(err);
    }

    spotId = parseInt(spotId);
    const review = await Review.create({
      ...req.body,
      userId,
      spotId,
    });

    res.status(201).json(review);
  }
);

module.exports = { router, validateReviewDetails };
