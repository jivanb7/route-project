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

module.exports = resourceNotFoundErrors;
