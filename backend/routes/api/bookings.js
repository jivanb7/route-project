const express = require("express");
const { requireAuth, bookingAuthorization } = require("../../utils/auth");
const { validateBookingDetails } = require("../../utils/validation.js");

const { Spot, Booking, SpotImage } = require("../../db/models");

const { formatBooking } = require("../../utils/recordFormatters.js");

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

// Edit a booking
router.put(
  "/:bookingId",
  requireAuth,
  bookingAuthorization,
  validateBookingDetails,
  async (req, res) => {
    const { bookingId } = req.params;

    const bookingToUpdate = await Booking.findByPk(bookingId);

    bookingToUpdate.set({
      ...req.body,
      updatedAt: new Date(),
    });

    await bookingToUpdate.save();

    const updatedBooking = await bookingToUpdate.reload();

    const formattedUpdatedBooking = formatBooking(updatedBooking);

    res.status(200).json(formattedUpdatedBooking);
  }
);

// Delete a booking by ID
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
