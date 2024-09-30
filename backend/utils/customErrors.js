const {
  proposedStartDateConflicts,
  proposedEndDateConflicts,
  proposedBookingSpansExistingBooking,
} = require("./helperFunctions.js");

// an object to collect all resource not found errors
const resourceNotFoundErrors = {};

const resources = [
  { errorName: "spot", messageName: "Spot" },
  { errorName: "spotImage", messageName: "Spot Image" },
  { errorName: "review", messageName: "Review" },
  { errorName: "reviewImage", messageName: "Review Image" },
  { errorName: "booking", messageName: "Booking" },
];

for (let resource of resources) {
  resourceNotFoundErrors[`${resource.errorName}NotFoundError`] = {
    title: `Couldn't find a ${resource.messageName} with the specified information`,
    message: `${resource.messageName} couldn't be found`,
    status: 404,
  };
}

// a function to generate an error if a booking conflicts with an already existing booking
const determineIfBookingConflicts = (proposedBooking, existingBookingsArr) => {
  const bookingConflictError = {
    message: "Sorry, this spot is already booked for the specified dates",
    status: 403,
    errors: {},
  };

  const conflict = "date conflicts with an existing booking";
  const startDateConflictMessage = `Start ${conflict}`;
  const endDateConflictMessage = `End ${conflict}`;

  for (let existingBooking of existingBookingsArr) {
    if (proposedStartDateConflicts(proposedBooking, existingBooking)) {
      bookingConflictError.errors.startDate = startDateConflictMessage;
    }

    if (proposedEndDateConflicts(proposedBooking, existingBooking)) {
      bookingConflictError.errors.endDate = endDateConflictMessage;
    }

    if (proposedBookingSpansExistingBooking(proposedBooking, existingBooking)) {
      bookingConflictError.errors.startDate = startDateConflictMessage;
      bookingConflictError.errors.endDate = endDateConflictMessage;
    }

    if (Object.keys(bookingConflictError.errors).length > 0) {
      return bookingConflictError;
    }
  }
};

module.exports = { resourceNotFoundErrors, determineIfBookingConflicts };
