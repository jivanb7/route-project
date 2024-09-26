"use strict";

const { SpotImage } = require("../models");

const spotImageData = [
  {
    spotId: 1,
    url: "https://www.example.com",
    preview: true,
  },
  {
    spotId: 1,
    url: "https://www.example-image-two.com",
  },
  {
    spotId: 1,
    url: "https://www.example-image-three.com",
  },
  {
    spotId: 2,
    url: "https://www.example-image-four.com",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://www.example-image-five.com",
  },
  {
    spotId: 2,
    url: "https://www.example-image-six.com",
  },
  {
    spotId: 3,
    url: "https://www.example-image-seven.com",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://www.example-image-eight.com",
  },
  {
    spotId: 3,
    url: "https://www.example-image-nine.com",
  },
  {
    spotId: 4,
    url: "https://www.example-image-ten.com",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://www.example-image-eleven.com",
  },
  {
    spotId: 4,
    url: "https://www.example-image-twelve.com",
  },
  {
    spotId: 5,
    url: "https://www.example-image-thirteen.com",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://www.example-image-fourteen.com",
  },
  {
    spotId: 5,
    url: "https://www.example-image-fifteen.com",
  },
  {
    spotId: 6,
    url: "https://www.example-image-sixteen.com",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://www.example-image-seventeen.com",
  },
  {
    spotId: 6,
    url: "https://www.example-image-eighteen.com",
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImageData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    for (let spotImage of spotImageData) {
      await SpotImage.destroy({
        where: spotImage,
      });
    }
  },
};
