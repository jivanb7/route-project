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
