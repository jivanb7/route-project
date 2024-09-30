const express = require("express");

const { requireAuth, spotAuthorization } = require("../../utils/auth");

const { getAverageRating } = require("../../utils/helperFunctions.js");

const {
  resourceNotFoundErrors,
  determineIfBookingConflicts,
} = require("../../utils/customErrors.js");

const { spotNotFoundError } = resourceNotFoundErrors;

const {
  formatBooking,
  formatTimestampsOfRecord,
  formatSpots,
} = require("../../utils/recordFormatters.js");

const {
  validateBookingDetails,
  validateReviewDetails,
  validateSpotDetails,
} = require("../../utils/validation");

const {
  Spot,
  SpotImage,
  Review,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");

const { Op } = require("sequelize");

const router = express.Router();

// get all spots
router.get("/", async (req, res, next) => {
  const queryObj = {
    where: {},
    include: [SpotImage, Review],
  };

  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const errorObj = {
    message: "Bad Request",
    status: 400,
    errors: {},
  };

  if (page) {
    page = Number(page);
    if (isNaN(page) || page <= 0) {
      errorObj.errors.page = "Page must be greater than or equal to 1";
    }
  }
  if (size) {
    size = Number(size);
    if (isNaN(size) || size < 1 || size > 20) {
      errorObj.errors.size = "Size must be between 1 and 20";
    }
  }

  if (minLat) {
    minLat = Number(minLat);
    if (isNaN(minLat) || minLat < -90 || minLat > 90) {
      errorObj.errors.minLat = "Minimum latitude is invalid";
    } else {
      queryObj.where.lat = { [Op.gte]: minLat };
    }
  }
  if (maxLat) {
    maxLat = Number(maxLat);
    if (isNaN(maxLat) || maxLat < -90 || maxLat > 90) {
      errorObj.errors.maxLat = "Maximum latitude is invalid";
    } else {
      queryObj.where.lat = { [Op.lte]: maxLat };
    }
  }
  if (minLng) {
    minLng = Number(minLng);
    if (isNaN(minLng) || minLng < -180 || minLng > 180) {
      errorObj.errors.minLng = "Minimum longitude is invalid";
    } else {
      queryObj.where.lng = { [Op.gte]: minLng };
    }
  }
  if (maxLng) {
    maxLng = Number(maxLng);
    if (isNaN(maxLng) || maxLng < -180 || maxLng > 180) {
      errorObj.errors.maxLng = "Maximum longitude is invalid";
    } else {
      queryObj.where.lng = { [Op.lte]: maxLng };
    }
  }
  if (minPrice) {
    minPrice = Number(minPrice);
    if (isNaN(minPrice) || minPrice < 0) {
      errorObj.errors.minPrice =
        "Minimum price must be greater than or equal to 0";
    } else {
      queryObj.where.price = { [Op.gte]: minPrice };
    }
  }
  if (maxPrice) {
    maxPrice = Number(maxPrice);
    if (isNaN(maxPrice) || maxPrice < 0) {
      errorObj.errors.maxPrice =
        "Maximum price must be greater than or equal to 0";
    } else {
      queryObj.where.price = { [Op.lte]: maxPrice };
    }
  }

  if (Object.keys(errorObj.errors).length > 0) {
    return next(errorObj);
  }

  if (!page) page = 1;
  if (!size) size = 20;

  queryObj.limit = size;
  queryObj.offset = size * (page - 1);

  let allSpots = await Spot.findAll(queryObj);

  res.status(200).json({ Spots: formatSpots(allSpots), page, size });
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

  let spot = await Spot.findByPk(spotId, {
    include: [
      { model: SpotImage, attributes: ["id", "url", "preview"] },
      Review,
      { model: User, attributes: ["id", "firstName", "lastName"] },
    ],
  });

  if (!spot) {
    return next(spotNotFoundError);
  }

  spot = spot.toJSON();

  const { Reviews, User: Owner, ...remainingSpotProperties } = spot;

  const numReviews = Reviews.length;
  const avgStarRating = getAverageRating(Reviews);

  const spotToReturn = {
    ...remainingSpotProperties,
    Owner,
    numReviews,
    avgStarRating,
  };

  formatTimestampsOfRecord(spotToReturn);

  res.status(200).json(spotToReturn);
});

// create a new spot
router.post("/", requireAuth, validateSpotDetails, async (req, res) => {
  const spotDetails = {
    ownerId: req.user.id,
    ...req.body,
  };

  let newSpot = await Spot.create(spotDetails);

  newSpot = newSpot.toJSON();

  formatTimestampsOfRecord(newSpot);

  res.status(201).json(newSpot);
});

// add an image to a spot by spot id
router.post(
  "/:spotId/images",
  requireAuth,
  spotAuthorization,
  async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    const newImageForSpot = await SpotImage.create({
      ...req.body,
      spotId: spot.id,
    });

    const imageData = newImageForSpot.toJSON();
    const {
      createdAt,
      updatedAt,
      spotId: idOfSpot,
      ...remainingProperties
    } = imageData;

    res.status(201).json(remainingProperties);
  }
);

// edit a spot by id
router.put(
  "/:spotId",
  requireAuth,
  spotAuthorization,
  validateSpotDetails,
  async (req, res) => {
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
    let updatedSpot = await spotToEdit.reload();

    updatedSpot = updatedSpot.toJSON();

    formatTimestampsOfRecord(updatedSpot);

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

  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
        include: [
          { model: ReviewImage, attributes: ["id", "url"] },
          { model: User, attributes: ["id", "firstName", "lastName"] },
        ],
      },
    ],
  });

  if (!spot) {
    return next(spotNotFoundError);
  }

  const { Reviews } = spot;

  Reviews.forEach((reviewObj, index) => {
    reviewObj = reviewObj.toJSON();
    formatTimestampsOfRecord(reviewObj);
    Reviews[index] = reviewObj;
  });

  res.status(200).json({ Reviews });
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
      return next(spotNotFoundError);
    }

    if (spot.Reviews.length > 0) {
      const err = new Error("User already has a review for this spot");
      err.message = "User already has a review for this spot";
      return next(err);
    }

    spotId = parseInt(spotId);
    let review = await Review.create({
      ...req.body,
      userId,
      spotId,
    });

    review = review.toJSON();

    formatTimestampsOfRecord(review);

    res.status(201).json(review);
  }
);

// get all bookings for a spot based on the spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return next(spotNotFoundError);
  }

  const spotBookings = await Booking.findAll({
    where: { spotId },
    include: {
      model: User,
      attributes: ["id", "firstName", "lastName"],
    },
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
  });

  const formattedSpotBookings = spotBookings.map((spotBooking, index) => {
    spotBooking = spotBooking.toJSON();
    return formatBooking(spotBooking);
  });

  let bookingsToDisplay;

  if (spot.ownerId === userId) {
    bookingsToDisplay = formattedSpotBookings;
  } else {
    const nonOwnerBookings = formattedSpotBookings.map((booking) => {
      const { spotId, startDate, endDate } = booking;
      return {
        spotId,
        startDate,
        endDate,
      };
    });

    bookingsToDisplay = nonOwnerBookings;
  }

  return res.status(200).json({ Bookings: bookingsToDisplay });
});

// create a booking from a spot based on the spot's id
router.post(
  "/:spotId/bookings",
  requireAuth,
  spotAuthorization,
  validateBookingDetails,
  async (req, res, next) => {
    let { spotId } = req.params;
    spotId = parseInt(spotId);

    const { startDate, endDate } = req.body;

    const proposedBooking = {
      startDate: new Date(`${startDate}`),
      endDate: new Date(`${endDate}`),
    };

    const spot = await Spot.findByPk(spotId, { include: [Booking] });

    if (!spot) {
      return next(spotNotFoundError);
    }

    const bookingConflictError = determineIfBookingConflicts(
      proposedBooking,
      spot.Bookings
    );

    if (bookingConflictError) {
      return next(bookingConflictError);
    }

    const newBooking = await Booking.create({
      userId: req.user.id,
      spotId,
      startDate,
      endDate,
    });

    return res.status(201).json(formatBooking(newBooking));
  }
);

module.exports = router;
