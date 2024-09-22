"use strict";

const { Booking } = require("../models");

const bookingsData = [
  {
    userId: 1,
    spotId: 3,
    startDate: "2025-11-19",
    endDate: "2025-11-20",
  },
  {
    userId: 2,
    spotId: 5,
    startDate: "2024-10-19",
    endDate: "2024-10-25",
  },
  {
    userId: 1,
    spotId: 5,
    startDate: "2026-01-19",
    endDate: "2026-01-30",
  },
  {
    userId: 3,
    spotId: 1,
    startDate: "2024-12-15",
    endDate: "2024-12-20",
  },
  {
    userId: 2,
    spotId: 2,
    startDate: "2025-04-12",
    endDate: "2025-04-15",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(bookingsData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    for (let booking of bookingsData) {
      await Booking.destroy({
        where: booking,
      });
    }
  },
};
