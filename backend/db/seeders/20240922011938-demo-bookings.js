"use strict";

const { Booking } = require("../models");

const bookingsData = [
  {
    startDate: "2025-11-19",
    endDate: "2025-11-20",
  },
  {
    startDate: "2024-10-19",
    endDate: "2024-10-25",
  },
  {
    startDate: "2026-01-19",
    endDate: "2026-01-30",
  },
  {
    startDate: "2024-12-15",
    endDate: "2024-12-20",
  },
  {
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
