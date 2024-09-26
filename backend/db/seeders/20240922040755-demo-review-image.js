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
    reviewId: 2,
    url: "https://www.myReviewImage4.com",
  },
  {
    reviewId: 3,
    url: "https://www.myReviewImage5.com",
  },
  {
    reviewId: 3,
    url: "https://www.myReviewImage6.com",
  },
  {
    reviewId: 4,
    url: "https://www.myReviewImage7.com",
  },
  {
    reviewId: 4,
    url: "https://www.myReviewImage8.com",
  },
  {
    reviewId: 5,
    url: "https://www.myReviewImage9.com",
  },
  {
    reviewId: 5,
    url: "https://www.myReviewImage10.com",
  },
  {
    reviewId: 6,
    url: "https://www.myReviewImage11.com",
  },
  {
    reviewId: 6,
    url: "https://www.myReviewImage12.com",
  },
  {
    reviewId: 7,
    url: "https://www.myReviewImage13.com",
  },
  {
    reviewId: 7,
    url: "https://www.myReviewImage14.com",
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
