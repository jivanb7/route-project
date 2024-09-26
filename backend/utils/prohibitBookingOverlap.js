// Functions to detect conflicts
const proposedStartDateConflicts = (
  proposedBooking,
  existingBooking,
  bookingConflictError
) => {
  const proposedStartDateString = proposedBooking.startDate.toUTCString();
  const existingStartDateString = existingBooking.startDate.toUTCString();
  if (
    proposedStartDateString === existingStartDateString ||
    (proposedBooking.startDate > existingBooking.startDate &&
      proposedBooking.startDate < existingBooking.endDate)
  ) {
    bookingConflictError.errors.startDate =
      "Start date conflicts with an existing booking";
  }
};

const proposedEndDateConflicts = (
  proposedBooking,
  existingBooking,
  bookingConflictError
) => {
  const proposedEndDateString = proposedBooking.endDate.toUTCString();
  const existingStartDateString = existingBooking.startDate.toUTCString();
  const existingEndDateString = existingBooking.endDate.toUTCString();
  if (
    proposedEndDateString === existingEndDateString ||
    (proposedBooking.endDate < existingBooking.endDate &&
      proposedBooking.endDate > existingBooking.startDate) ||
    proposedEndDateString === existingStartDateString
  ) {
    bookingConflictError.errors.endDate =
      "End date conflicts with an existing booking";
  }
};

const proposedBookingSpansExistingBooking = (
  proposedBooking,
  existingBooking,
  bookingConflictError
) => {
  if (
    proposedBooking.startDate < existingBooking.startDate &&
    proposedBooking.endDate > existingBooking.endDate
  ) {
    bookingConflictError.errors.startDate =
      "Start date conflicts with an existing booking";
    bookingConflictError.errors.endDate =
      "End date conflicts with an existing booking";
  }
};

module.exports = {
  proposedStartDateConflicts,
  proposedEndDateConflicts,
  proposedBookingSpansExistingBooking,
};
