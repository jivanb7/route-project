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
  {
    userId: 4,
    spotId: 7,
    startDate: "2025-11-21",
    endDate: "2025-11-25"
  },
  {
    userId: 5,
    spotId: 6,
    startDate: "2024-11-01",
    endDate: "2024-11-10"
  },
  {
    userId: 6,
    spotId: 8,
    startDate: "2025-01-02",
    endDate: "2025-01-05"
  },
  {
    userId: 7,
    spotId: 9,
    startDate: "2025-12-01",
    endDate: "2025-12-10"
  },
  {
    userId: 8,
    spotId: 10,
    startDate: "2025-05-01",
    endDate: "2025-05-05"
  },
  {
    userId: 9,
    spotId: 11,
    startDate: "2024-12-01",
    endDate: "2024-12-07"
  },
  {
    userId: 10,
    spotId: 12,
    startDate: "2024-12-21",
    endDate: "2024-12-23"
  },
  {
    userId: 4,
    spotId: 13,
    startDate: "2026-01-01",
    endDate: "2026-01-05"
  },
  {
    userId: 5,
    spotId: 14,
    startDate: "2025-03-01",
    endDate: "2025-03-04"
  },
  {
    userId: 6,
    spotId: 15,
    startDate: "2026-02-01",
    endDate: "2026-02-10"
  },
  {
    userId: 7,
    spotId: 16,
    startDate: "2025-01-10",
    endDate: "2025-01-12"
  },
  {
    userId: 8,
    spotId: 17,
    startDate: "2025-12-12",
    endDate: "2025-12-18"
  },
  {
    userId: 9,
    spotId: 18,
    startDate: "2025-06-01",
    endDate: "2025-06-07"
  },
  {
    userId: 10,
    spotId: 19,
    startDate: "2024-11-15",
    endDate: "2024-11-20"
  },
  {
    userId: 1,
    spotId: 20,
    startDate: "2025-01-15",
    endDate: "2025-01-20"
  },
  {
    userId: 2,
    spotId: 12,
    startDate: "2025-11-26",
    endDate: "2025-11-30"
  },
  {
    userId: 3,
    spotId: 13,
    startDate: "2025-05-10",
    endDate: "2025-05-15"
  },
  {
    userId: 4,
    spotId: 14,
    startDate: "2026-01-31",
    endDate: "2026-02-05"
  },
  {
    userId: 5,
    spotId: 15,
    startDate: "2024-12-25",
    endDate: "2024-12-30"
  },
  {
    userId: 6,
    spotId: 16,
    startDate: "2026-01-06",
    endDate: "2026-01-10"
  }
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
