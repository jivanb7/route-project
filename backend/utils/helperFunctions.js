const getAverageRating = (reviews) => {
  let sumOfRatings = 0;
  reviews.forEach((review) => {
    sumOfRatings += review.stars;
  });
  const average = sumOfRatings / reviews.length;

  if (!average) {
    return null;
  }

  return average;
};

const makeAllNumsDoubleDigit = (numStrArray) => {
  numStrArray.forEach((numStr, index) => {
    if (numStr.length === 1) {
      numStr = "0" + numStr;
    }
    numStrArray[index] = numStr;
  });

  return numStrArray;
};

// Date and Time Formatters

const formatDate = (dateObj) => {
  let localDateString = dateObj.toLocaleDateString();
  let partsOfDate = localDateString.split("/");
  partsOfDate = makeAllNumsDoubleDigit(partsOfDate);

  return `${partsOfDate[2]}-${partsOfDate[0]}-${partsOfDate[1]}`;
};

const formatTimeStamp = (timeArray) => {
  timeArray = makeAllNumsDoubleDigit(timeArray);

  return timeArray.join(":");
};

const singleDateFormatter = (dateObj, withTimeStamp = "") => {
  let formattedDate = formatDate(dateObj);
  if (withTimeStamp) {
    const formattedTimeStamp = formatTimeStamp([
      dateObj.getHours().toString(),
      dateObj.getMinutes().toString(),
      dateObj.getSeconds().toString(),
    ]);
    formattedDate += ` ${formattedTimeStamp}`;
  }
  return formattedDate;
};

const multipleDateFormatter = (createdAt, updatedAt, ...dates) => {
  const allDates = [createdAt, updatedAt, ...dates];
  allDates.forEach((dateObj, dateIndex) => {
    let formattedDate;
    if (dateIndex < 2) {
      formattedDate = singleDateFormatter(dateObj, "withTimeStamp");
    } else {
      formattedDate = singleDateFormatter(dateObj);
    }

    allDates[dateIndex] = formattedDate;
  });

  return allDates;
};

// Functions to Detect Booking Conflicts

const proposedStartDateConflicts = (
  proposedBooking,
  existingBooking,
  bookingConflictError
) => {
  // const proposedStartDateString = proposedBooking.startDate.toUTCString();
  // const existingStartDateString = existingBooking.startDate.toUTCString();
  const proposedStartDateString =
    proposedBooking.startDate.toLocaleDateString();
  const existingStartDateString =
    existingBooking.startDate.toLocaleDateString();

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
  // const proposedEndDateString = proposedBooking.endDate.toUTCString();
  // const existingStartDateString = existingBooking.startDate.toUTCString();
  // const existingEndDateString = existingBooking.endDate.toUTCString();
  const proposedEndDateString = proposedBooking.endDate.toLocaleDateString();
  const existingStartDateString =
    existingBooking.startDate.toLocaleDateString();
  const existingEndDateString = existingBooking.endDate.toLocaleDateString();
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
  getAverageRating,
  multipleDateFormatter,
  proposedBookingSpansExistingBooking,
  proposedStartDateConflicts,
  proposedEndDateConflicts,
};
