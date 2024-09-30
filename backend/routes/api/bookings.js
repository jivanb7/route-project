const express = require("express");
const { requireAuth, bookingAuthorization } = require("../../utils/auth");
const { validateBookingDetails } = require("../../utils/validation.js");

const { Spot, Booking, SpotImage } = require("../../db/models");

const { formatBooking } = require("../../utils/recordFormatters.js");
const { determineIfBookingConflicts } = require("../../utils/customErrors.js");

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  const userBookings = await Booking.findAll({
    include: [
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            attributes: ["url", "preview"],
          },
        ],
        attributes: {
          exclude: ["description", "createdAt", "updatedAt"],
        },
      },
    ],
    where: {
      userId: req.user.id,
    },
  });

  const formattedBookings = userBookings.map((booking) => {
    return formatBooking(booking);
  });
  res.status(200).json({ Bookings: formattedBookings });
});

// edit a booking by bookingId
router.put(
  "/:bookingId",
  requireAuth,
  bookingAuthorization,
  validateBookingDetails,
  async (req, res, next) => {
    const { bookingId } = req.params;

    let bookingToUpdate = await Booking.findByPk(bookingId, {
      include: { model: Spot, include: [{ model: Booking }] },
    });

    const otherExistingBookings = bookingToUpdate.Spot.Bookings.filter(
      (booking) => booking.id !== Number(bookingId)
    );

    const bookingConflictError = determineIfBookingConflicts(
      req.body,
      otherExistingBookings
    );

    if (bookingConflictError) {
      return next(bookingConflictError);
    }

    bookingToUpdate.set({
      ...req.body,
      updatedAt: new Date(),
    });

    await bookingToUpdate.save();

    const updatedBooking = await bookingToUpdate.reload();

    const { id, spotId, userId, startDate, endDate, createdAt, updatedAt } =
      updatedBooking;

    const bookingDetailsToDisplay = {
      id,
      spotId,
      userId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    };

    const formattedUpdatedBooking = formatBooking(bookingDetailsToDisplay);

    res.status(200).json(formattedUpdatedBooking);
  }
);

// delete a booking by bookingId
router.delete(
  "/:bookingId",
  requireAuth,
  bookingAuthorization,
  async (req, res, next) => {
    const { bookingId } = req.params;

    const bookingToDelete = await Booking.findByPk(bookingId);

    const today = new Date();
    if (new Date(bookingToDelete.startDate) < today) {
      const err = {
        status: 403,
        message: "Bookings that have been started can't be deleted",
      };
      return next(err);
    }

    await Booking.destroy({
      where: {
        id: bookingId,
      },
    });

    res.status(200).json({ message: "Successfully deleted" });
  }
);

module.exports = router;
