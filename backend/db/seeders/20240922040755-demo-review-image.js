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
    reviewId: 4,
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
    reviewId: 6,
    url: "https://www.myReviewImage13.com",
  },
  {
    reviewId: 7,
    url: "https://www.myReviewImage14.com",
  },
  {
    reviewId: 7,
    url: "https://www.myReviewImage15.com",
  },
  {
    reviewId: 7,
    url: "https://www.myReviewImage16.com",
  },
  {
    reviewId: 7,
    url: "https://www.myReviewImage17.com",
  },
  {
    reviewId: 8,
    url: "https://www.myReviewImage18.com",
  },
  {
    reviewId: 8,
    url: "https://www.myReviewImage19.com",
  },
  {
    reviewId: 8,
    url: "https://www.myReviewImage20.com",
  },
  {
    reviewId: 9,
    url: "https://www.myReviewImage21.com",
  },
  {
    reviewId: 9,
    url: "https://www.myReviewImage22.com",
  },
  {
    reviewId: 9,
    url: "https://www.myReviewImage23.com",
  },
  {
    reviewId: 9,
    url: "https://www.myReviewImage24.com",
  },
  {
    reviewId: 10,
    url: "https://www.myReviewImage25.com",
  },
  {
    reviewId: 10,
    url: "https://www.myReviewImage26.com",
  },
  {
    reviewId: 10,
    url: "https://www.myReviewImage27.com",
  },
  {
    reviewId: 11,
    url: "https://www.myReviewImage28.com",
  },
  {
    reviewId: 11,
    url: "https://www.myReviewImage29.com",
  },
  {
    reviewId: 12,
    url: "https://www.myReviewImage30.com",
  },
  {
    reviewId: 12,
    url: "https://www.myReviewImage31.com",
  },
  {
    reviewId: 12,
    url: "https://www.myReviewImage32.com",
  },
  {
    reviewId: 13,
    url: "https://www.myReviewImage33.com",
  },
  {
    reviewId: 13,
    url: "https://www.myReviewImage34.com",
  },
  {
    reviewId: 13,
    url: "https://www.myReviewImage35.com",
  },
  {
    reviewId: 14,
    url: "https://www.myReviewImage36.com",
  },
  {
    reviewId: 14,
    url: "https://www.myReviewImage37.com",
  },
  {
    reviewId: 14,
    url: "https://www.myReviewImage38.com",
  },
  {
    reviewId: 14,
    url: "https://www.myReviewImage39.com",
  },
  {
    reviewId: 15,
    url: "https://www.myReviewImage40.com",
  },
  {
    reviewId: 15,
    url: "https://www.myReviewImage41.com",
  },
  {
    reviewId: 16,
    url: "https://www.myReviewImage42.com",
  },
  {
    reviewId: 16,
    url: "https://www.myReviewImage43.com",
  },
  {
    reviewId: 16,
    url: "https://www.myReviewImage44.com",
  },
  {
    reviewId: 17,
    url: "https://www.myReviewImage45.com",
  },
  {
    reviewId: 17,
    url: "https://www.myReviewImage46.com",
  },
  {
    reviewId: 17,
    url: "https://www.myReviewImage47.com",
  },
  {
    reviewId: 18,
    url: "https://www.myReviewImage48.com",
  },
  {
    reviewId: 18,
    url: "https://www.myReviewImage49.com",
  },
  {
    reviewId: 18,
    url: "https://www.myReviewImage50.com",
  },
  {
    reviewId: 19,
    url: "https://www.myReviewImage51.com",
  },
  {
    reviewId: 19,
    url: "https://www.myReviewImage52.com",
  },
  {
    reviewId: 19,
    url: "https://www.myReviewImage53.com",
  },
  {
    reviewId: 20,
    url: "https://www.myReviewImage54.com",
  },
  {
    reviewId: 20,
    url: "https://www.myReviewImage55.com",
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
