"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotsData = [
  {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
  },
  {
    ownerId: 1,
    address: "123 Main Street",
    city: "Denver",
    state: "Colorado",
    country: "United States of America",
    lat: 40.7645358,
    lng: -340.4730327,
    name: "Great Spot",
    description: "This is an awesome place to stay",
    price: 354.34,
  },
  {
    ownerId: 2,
    address: "123 Fake Lane",
    city: "Philadelphia",
    state: "Pennsylvania",
    country: "United States of America",
    lat: 74.7645358,
    lng: -243.4730327,
    name: "Another Place",
    description: "Great house with a nice pool",
    price: 245,
  },
  {
    ownerId: 2,
    address: "123 Imaginary Lane",
    city: "Los Angeles",
    state: "California",
    country: "United States of America",
    lat: 54.7645358,
    lng: -123.4730327,
    name: "Canopy House",
    description: "Nice, relaxing environment",
    price: 248,
  },
  {
    ownerId: 3,
    address: "123 Broad Street",
    city: "New York",
    state: "New York",
    country: "United States of America",
    lat: 45.7645358,
    lng: -134.4730327,
    name: "Demo Place",
    description: "Great place to unwind and stay while in New York City!",
    price: 347,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(spotsData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: spotsData.map((spot) => {
            return spot.address;
          }),
        },
      },
      {}
    );
  },
};
