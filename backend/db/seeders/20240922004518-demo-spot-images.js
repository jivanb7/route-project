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
    spotId: 3,
    url: "https://www.example-spotimage-three.com",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://www.example-spotimage-three-two.com",
  },
  {
    spotId: 4,
    url: "https://www.example-spotimage-four.com",
    preview: true,
  },
  {
    spotId: 4,
    url: "https://www.example-spotimage-four-two.com",
  },
  {
    spotId: 5,
    url: "https://www.example-spotimage-five.com",
    preview: true,
  },
  {
    spotId: 5,
    url: "https://www.example-spotimage-five-two.com",
  },
  {
    spotId: 5,
    url: "https://www.example-spotimage-five-three.com",
  },
  {
    spotId: 6,
    url: "https://www.example-spotimage-six.com",
    preview: true,
  },
  {
    spotId: 6,
    url: "https://www.example-spotimage-six-two.com",
  },
  {
    spotId: 6,
    url: "https://www.example-spotimage-six-three.com",
  },
  {
    spotId: 6,
    url: "https://www.example-spotimage-six-four.com",
  },
  {
    spotId: 7,
    url: "https://www.example-spotimage-seven.com",
    preview: true,
  },
  {
    spotId: 7,
    url: "https://www.example-spotimage-seven-two.com",
  },
  {
    spotId: 8,
    url: "https://www.example-spotimage-eight.com",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://www.example-spotimage-nine.com",
    preview: true,
  },
  {
    spotId: 9,
    url: "https://www.example-spotimage-nine-two.com",
  },
  {
    spotId: 9,
    url: "https://www.example-spotimage-nine-three.com",
  },
  {
    spotId: 10,
    url: "https://www.example-spotimage-ten.com",
    preview: true,
  },
  {
    spotId: 10,
    url: "https://www.example-spotimage-ten-two.com",
  },
  {
    spotId: 11,
    url: "https://www.example-spotimage-eleven.com",
    preview: true,
  },
  {
    spotId: 11,
    url: "https://www.example-spotimage-eleven-two.com",
  },
  {
    spotId: 12,
    url: "https://www.example-spotimage-twelve.com",
    preview: true,
  },
  {
    spotId: 12,
    url: "https://www.example-spotimage-twelve-two.com",
  },
  {
    spotId: 12,
    url: "https://www.example-spotimage-twelve-three.com",
  },
  {
    spotId: 12,
    url: "https://www.example-spotimage-twelve-four.com",
  },
  {
    spotId: 13,
    url: "https://www.example-spotimage-thirteen.com",
    preview: true,
  },
  {
    spotId: 13,
    url: "https://www.example-spotimage-thirteen-two.com",
  },
  {
    spotId: 13,
    url: "https://www.example-spotimage-thirteen-three.com",
  },
  {
    spotId: 14,
    url: "https://www.example-spotimage-fourteen.com",    
    preview: true,
  },
  {
    spotId: 14,
    url: "https://www.example-spotimage-fourteen-two.com",    
  },
  {
    spotId: 15,
    url: "https://www.example-spotimage-fifteen.com",
    preview: true,
  },
  {
    spotId: 15,
    url: "https://www.example-spotimage-fifteen-two.com",
  },
  {
    spotId: 15,
    url: "https://www.example-spotimage-fifteen-three.com",
  },
  {
    spotId: 16,
    url: "https://www.example-spotimage-sixteen.com",
    preview: true,
  },
  {
    spotId: 16,
    url: "https://www.example-spotimage-sixteen-two.com",
  },
  {
    spotId: 17,
    url: "https://www.example-spotimage-seventeen.com",
    preview: true,
  },
  {
    spotId: 17,
    url: "https://www.example-spotimage-seventeen-two.com",
  },
  {
    spotId: 17,
    url: "https://www.example-spotimage-seventeen-three.com",
  },
  {
    spotId: 18,
    url: "https://www.example-spotimage-eighteen.com",
    preview: true,
  },
  {
    spotId: 18,
    url: "https://www.example-spotimage-eighteen-two.com",
  },
  {
    spotId: 18,
    url: "https://www.example-spotimage-eighteen-three.com",
  },
  {
    spotId: 18,
    url: "https://www.example-spotimage-eighteen-four.com",
  },
  {
    spotId: 18,
    url: "https://www.example-spotimage-eighteen-five.com",
  },
  {
    spotId: 19,
    url: "https://www.example-spotimage-nineteen.com",
    preview: true,
  },
  {
    spotId: 19,
    url: "https://www.example-spotimage-nineteen-two.com",
  },
  {
    spotId: 20,
    url: "https://www.example-spotimage-twenty.com",
    preview: true,
  },
  {
    spotId: 20,
    url: "https://www.example-spotimage-twenty-two.com",
  },
  {
    spotId: 20,
    url: "https://www.example-spotimage-twenty-three.com",
  },
  {
    spotId: 20,
    url: "https://www.example-spotimage-twenty-four.com",
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
