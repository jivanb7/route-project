const {
  multipleDateFormatter,
  getAverageRating,
} = require("./helperFunctions.js");

const formatTimestampsOfRecord = (recordObj) => {
  const { createdAt, updatedAt } = recordObj;
  const [formattedCreatedAt, formattedUpdatedAt] = multipleDateFormatter(
    createdAt,
    updatedAt
  );
  recordObj.createdAt = formattedCreatedAt;
  recordObj.updatedAt = formattedUpdatedAt;
};

const formatBooking = (booking) => {
  const {
    id: bookingId,
    userId,
    spotId,
    startDate,
    endDate,
    createdAt,
    updatedAt,
    Spot,
    User,
  } = booking;

  const [
    formattedCreatedAt,
    formattedUpdatedAt,
    formattedStartDate,
    formattedEndDate,
  ] = multipleDateFormatter(createdAt, updatedAt, startDate, endDate);

  const formattedBooking = {
    id: bookingId,
    spotId,
    userId,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt,
  };

  if (Spot) {
    const {
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      price,
      SpotImages,
    } = Spot;

    const previewImage = SpotImages.find((image) => image.preview); // either an object with .url or undefined

    formattedBooking.Spot = {
      id: spotId,
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      price,
    };

    formattedBooking.Spot.previewImage = previewImage ? previewImage.url : null;
  }

  if (User) {
    formattedBooking.User = User;
  }

  return formattedBooking;
};

const formatSpots = (spotsArray) => {
  return spotsArray.map((spot) => {
    spot = spot.toJSON();

    const { Reviews, SpotImages, ...remainingSpotProperties } = spot;

    const avgRating = getAverageRating(Reviews);

    const formattedSpot = {
      ...remainingSpotProperties,
      avgRating,
    };

    const previewImage = SpotImages.find((spotImage) => spotImage.preview);

    formattedSpot.previewImage = previewImage ? previewImage.url : null;

    formatTimestampsOfRecord(formattedSpot);

    return formattedSpot;
  });
};

const formatReview = (reviewObj) => {
  const {
    id,
    userId,
    spotId,
    review,
    stars,
    createdAt,
    updatedAt,
    User,
    ReviewImages,
    Spot,
  } = reviewObj;

  const [formattedCreatedAt, formattedUpdatedAt] = multipleDateFormatter(
    createdAt,
    updatedAt
  );

  const formattedReview = {
    id,
    userId,
    spotId,
    review,
    stars,
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt,
  };

  if (User) {
    formattedReview.User = User;
  }

  if (ReviewImages) {
    formattedReview.ReviewImages = ReviewImages;
  }

  if (Spot) {
    const {
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      price,
      SpotImages,
    } = Spot;

    formattedReview.Spot = {
      id: spotId,
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      price,
    };

    const previewImg = SpotImages.find((spotImage) => spotImage.preview);

    formattedReview.Spot.previewImage = previewImg ? previewImg.url : null;
  }

  return formattedReview;
};

module.exports = {
  formatBooking,
  formatTimestampsOfRecord,
  formatSpots,
  formatReview,
};
