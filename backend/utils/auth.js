// backend/utils/auth.js
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { resourceNotFoundErrors } = require("./customErrors.js");

const {
  spotNotFoundError,
  spotImageNotFoundError,
  bookingNotFoundError,
  reviewNotFoundError,
  reviewImageNotFoundError,
} = resourceNotFoundErrors;

const {
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
} = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  const token = jwt.sign({ data: safeUser }, secret, {
    expiresIn: parseInt(expiresIn),
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.message = "Authentication required";
  err.status = 401;
  return next(err);
};

// Authorization

const blockAuthorization = function (next) {
  const err = new Error("Require proper authorization");
  err.title = "Require proper authorization";
  err.status = 403;
  err.message = "Forbidden";
  return next(err);
};

const spotAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  const { spotId } = req.params;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return next(spotNotFoundError);
  }

  if (
    (req.url.includes("bookings") && userId === spot.ownerId) ||
    (!req.url.includes("bookings") && userId !== spot.ownerId)
  ) {
    return blockAuthorization(next);
  }

  next();
};

const spotImageAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  const { imageId } = req.params;

  const spotImage = await SpotImage.findOne({
    where: { id: imageId },
    include: [Spot],
  });

  if (!spotImage) {
    return next(spotImageNotFoundError);
  }

  if (userId !== spotImage.Spot.ownerId) {
    return blockAuthorization(next);
  }

  next();
};

const reviewAuthorization = async (req, _res, next) => {
  const userId = req.user.id;

  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);

  if (!review) {
    return next(reviewNotFoundError);
  }

  if (userId !== review.userId) {
    return blockAuthorization(next);
  }

  next();
};

const reviewImageAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  let { imageId } = req.params;

  if (req.url === "/undefined") {
    return blockAuthorization(next);
  }

  const reviewImage = await ReviewImage.findOne({
    where: { id: imageId },
    include: [Review],
  });

  if (!reviewImage) {
    return next(reviewImageNotFoundError);
  }

  if (userId !== reviewImage.Review.userId) {
    return blockAuthorization(next);
  }

  next();
};

const bookingAuthorization = async (req, _res, next) => {
  const userId = req.user.id;
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId, {
    include: [Spot],
  });

  if (!booking) {
    return next(bookingNotFoundError);
  }

  if (req.method === "DELETE") {
    if (userId !== booking.userId && userId !== booking.Spot.ownerId) {
      return blockAuthorization(next);
    }
  } else if (req.method === "PUT") {
    if (userId !== booking.userId) {
      return blockAuthorization(next);
    }
  }

  next();
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  blockAuthorization,
  spotAuthorization,
  spotImageAuthorization,
  reviewAuthorization,
  reviewImageAuthorization,
  bookingAuthorization,
};
