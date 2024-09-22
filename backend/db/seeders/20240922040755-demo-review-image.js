"use strict";

const { ReviewImage } = require("../models");

const reviewImagesData = [
  {
    reviewId: 1,
    url: "https://www.myReviewImage.com",
  },
  {
    reviewId: 1,
    url: "https://www.myReviewImage2.com",
  },
  {
    reviewId: 2,
    url: "https://www.myReviewImage3.com",
  },
  {
    reviewId: 3,
    url: "https://www.myReviewImage4.com",
  },
  {
    reviewId: 3,
    url: "https://www.myReviewImage5.com",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImagesData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    for (let reviewImage of reviewImagesData) {
      await ReviewImage.destroy({
        where: reviewImage,
      });
    }
  },
};
