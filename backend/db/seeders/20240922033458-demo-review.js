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
  {
    userId: 4,
    spotId: 8,
    review: "Good for short stays.",
    stars: 4
  },
  {
    userId: 5,
    spotId: 6,
    review: "Perfect getaway for the weekend.",
    stars: 5
  },
  {
    userId: 6,
    spotId: 7,
    review: "Lovely ambiance but too crowded.",
    stars: 3
  },
  {
    userId: 7,
    spotId: 3,
    review: "The location was perfect for relaxation.",
    stars: 5
  },
  {
    userId: 8,
    spotId: 12,
    review: "It was okay, but overpriced for what it offers.",
    stars: 3
  },
  {
    userId: 9,
    spotId: 11,
    review: "Best spot I've ever stayed at!",
    stars: 5
  },
  {
    userId: 10,
    spotId: 9,
    review: "Quiet and peaceful, great for unwinding.",
    stars: 4
  },
  {
    userId: 3,
    spotId: 10,
    review: "Absolutely loved this place, can't wait to return.",
    stars: 5
  },
  {
    userId: 4,
    spotId: 14,
    review: "The service was poor, but the spot itself was beautiful.",
    stars: 2
  },
  {
    userId: 5,
    spotId: 20,
    review: "Great for family vacations!",
    stars: 5
  },
  {
    userId: 6,
    spotId: 15,
    review: "It was a solid experience, but nothing exceptional.",
    stars: 4
  },
  {
    userId: 7,
    spotId: 16,
    review: "Loved the decor and surroundings, very relaxing.",
    stars: 5
  },
  {
    userId: 8,
    spotId: 9,
    review: "Decent spot, but could use better maintenance.",
    stars: 3
  },
  {
    userId: 9,
    spotId: 17,
    review: "Incredible spot, highly recommended for anyone.",
    stars: 5
  },
  {
    userId: 10,
    spotId: 19,
    review: "Overhyped, I expected much more.",
    stars: 2
  }
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
