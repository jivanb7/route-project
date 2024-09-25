
const express = require("express");
const { requireAuth, blockAuthorization } = require("../../utils/auth");
const { Spot, Booking, SpotImage } = require("../../db/models");
const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {  
    const userBookings = await Booking.findAll({
        include: [{
            model: Spot,
            include: [{
                model: SpotImage,
                attributes: ["url", "preview"]
            }],
            attributes: {
                exclude: ["description", "createdAt", "updatedAt"]
            },
        }],
        where: {
            userId: req.user.id
        }
    })

    const formattedBookings = userBookings.map(booking => {
        const { id: bookingId, userId, startDate, endDate, createdAt, updatedAt } = booking;                                          // DESTRUCTURE BOOKING ATTRIBUTES
        const spot = booking.Spot;                                                                              // SPOT PROPERTY STORED IN SPOT
        const { id: spotId, ownerId, address, city, state, country, lat, lng, name, price, SpotImages } = spot; // DESTRUCTURE SPOT ATTRIBUTES
        const previewImage = SpotImages.find(image => image.preview);                                           // FIND PREVIEW IMAGE

        const formattedBooking = {
            id: bookingId,
            spotId,
            Spot: {
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
            },
            userId,
            startDate,
            endDate,
            createdAt,
            updatedAt,
        };

        if (previewImage) {
            formattedBooking.previewImage = previewImage.url
        }

        return formattedBooking;

    });
    res.status(200).json({ Bookings: formattedBookings });
});

// Edit a booking 
router.put("/:bookingId", requireAuth, async (req, res) => {

})

const bookingNotFoundError = new Error("Couldn't find a Booking with the specified id")
bookingNotFoundError.message = "Booking couldn't be found";
bookingNotFoundError.status = 404;

const bookingAuthorization = async (req, _res, next) => {
    const userId = req.user.id;
    const { bookingId } = req.params;

    // query the booking table for this booking by id
    // include spot
    const booking = await Booking.findByPK(bookingId, {
        include: [Spot],
    })

    // if not found, return error of booking not found
    if (!booking) {
        return next(bookingNotFoundError);
    }

    // if user is not the owner of the booking, or
    // the owner of the spot, return blockAuthorization (next)
    if (userId !== booking.userId && userId !== booking.Spot.ownerId) {
        return blockAuthorization(next);
    }
    next();
}

// Delete a booking by ID
router.delete("/:bookingId", requireAuth, bookingAuthorization, async (req, res, next) => {
    const { bookingId } = req.params; // GET BOOKING ID FROM REQ

    const bookingToDelete = await Booking.findByPk(bookingId); // FIND BOOKING ID

    const today = new Date(); 
    if (new Date(bookingToDelete.startDate) < today) { // CHECK TO SEE IF TODAY'S DATE IS AFTER THE START DATE
        const err = {status: 403, message: "Bookings that have been started can't be deleted"}
        return next(err);
    };

    await Booking.destroy({
        where: {
            id: bookingId,  // USE DESTROY AND TARGET ID WHICH DELETES THE WHOLE INSTANCE
        },
    });

    res.status(200).json({ message: "Successfully deleted" }); 
});

module.exports = router; 
