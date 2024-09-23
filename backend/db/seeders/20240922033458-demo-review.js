"use strict";

const { Review } = require("../models");

const reviewsData = [
  {
    userId: 1,
    spotId: 3,
    review: "This was an awesome spot!",
    stars: 5,
  },
  {
    userId: 2,
    spotId: 5,
    review: "I had a great time staying here, highly recommended!",
    stars: 5,
  },
  {
    userId: 1,
    spotId: 5,
    review: "Pretty nice.",
    stars: 4,
  },
  {
    userId: 3,
    spotId: 1,
    review: "This was an ok spot.",
    stars: 3,
  },
  {
    userId: 2,
    spotId: 2,
    review: "This was an awesome spot!",
    stars: 5,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(reviewsData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    for (let review of reviewsData) {
      await Review.destroy({
        where: review,
      });
    }
  },
};
