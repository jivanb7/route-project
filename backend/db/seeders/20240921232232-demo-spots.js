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
    lat: 37.2798729,
    lng: -122.234897234,
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
    lat: 40.238479,
    lng: -58.38648276,
    name: "Great Spot",
    description: "This is an awesome place to stay",
    price: 354,
  },
  {
    ownerId: 2,
    address: "123 Fake Lane",
    city: "Philadelphia",
    state: "Pennsylvania",
    country: "United States of America",
    lat: 74,
    lng: -24.34787384,
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
    lat: 54.38497987324,
    lng: -123,
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
    lat: 45.48329749,
    lng: -134.3247987,
    name: "Demo Place",
    description: "Great place to unwind and stay while in New York City!",
    price: 347,
  },
  {
    ownerId: 1,
    address: "123 Broad Street Apt 2",
    city: "New York",
    state: "New York",
    country: "United States of America",
    lat: 45.82739487234,
    lng: -134.2837928734,
    name: "Demo Place Duplicate",
    description:
      "Great duplicate ofplace to unwind and stay while in New York City!",
    price: 347,
  },
  {
    ownerId: 7,
    address: "33 Lammer St",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 23.238497293,
    lng: -101.283947982374,
    name: "Family Home",
    description: "Beautiful landscape and scenery over the city!",
    price: 450,
  },
  {
    ownerId: 9,
    address: "West 54th St",
    city: "Seattle",
    state: "Oregon",
    country: "United States of America",
    lat: 77.2348978,
    lng: -162.2384798,
    name: "Multi-Family Home",
    description:
      "Awesome neighborhood, with multiple cool amentities and features!",
    price: 85.5,
  },
  {
    ownerId: 10,
    address: "22 Lake Drive",
    city: "Yorkshire",
    state: "Washington",
    country: "United States of America",
    lat: 57.2347,
    lng: -123.47987234,
    name: "Single Family Home",
    description: "Great Spot for a single family home!",
    price: 278,
  },
  {
    ownerId: 6,
    address: "10 Fatal Fields",
    city: "New Orleans",
    state: "Louisana",
    country: "United States of America",
    lat: 45,
    lng: -134,
    name: "Farm House",
    description:
      "Countryside provides great warmth and friendliness to all, scenery away from the city is something special!",
    price: 400,
  },
  {
    ownerId: 4,
    address: "39 Independence St",
    city: "Greenville",
    state: "Virginia",
    country: "United States of America",
    lat: 83,
    lng: -131,
    name: "Small Family Home",
    description:
      "Newly built home right in the middle where it all started, convenient location for access to city.",
    price: 167,
  },
  {
    ownerId: 6,
    address: "63rd St",
    city: "Chicago",
    state: "Illinois",
    country: "United States of America",
    lat: 72,
    lng: -173,
    name: "Apartment",
    description: "Great place to live to be right next to the big city!",
    price: 117,
  },
  {
    ownerId: 7,
    address: "101 Fire St",
    city: "Houston",
    state: "Texas",
    country: "United States of America",
    lat: 29,
    lng: -127,
    name: "Ranch-Style Home",
    description: "Awesome view of the countryside, and tons of open space!",
    price: 347,
  },
  {
    ownerId: 8,
    address: "West Santa Blvd",
    city: "Los Angeles",
    state: "California",
    country: "United States of America",
    lat: 28,
    lng: -169,
    name: "Townhome",
    description: "Fantastic place to crash to enjoy the amazing city of LA!",
    price: 477,
  },
  {
    ownerId: 9,
    address: "9 Hotsprings St",
    city: "Phoenix",
    state: "Arizona",
    country: "United States of America",
    lat: 30,
    lng: -114,
    name: "Condo",
    description:
      "Great place to stay if interested in hiking and outdoors activities, it's awesome!",
    price: 157,
  },
  {
    ownerId: 10,
    address: "East Corner Drive",
    city: "Monroe",
    state: "Montana",
    country: "United States of America",
    lat: 29,
    lng: -154,
    name: "Cabin Home",
    description:
      "Beautiful scenery of the outdoor area and just right next to the big city!",
    price: 248,
  },
  {
    ownerId: 3,
    address: "20 Printing Press St",
    city: "Boston",
    state: "Massachusetts",
    country: "United States of America",
    lat: 87,
    lng: -129,
    name: "Tiny Home",
    description:
      "While next to the big city, enjoy the fantastic view of the sea!",
    price: 311,
  },
  {
    ownerId: 5,
    address: "101 Oak Drive",
    city: "Franklin",
    state: "Tennessee",
    country: "United States of America",
    lat: 34,
    lng: -155,
    name: "Single Family Home",
    description:
      "Living in a great community comes with great people to help support one another, come enjoy the experience!",
    price: 100,
  },
  {
    ownerId: 6,
    address: "392 Madison St",
    city: "Madison",
    state: "Wisconsin",
    country: "United States of America",
    lat: 23,
    lng: -128,
    name: "Big Home",
    description:
      "Great place to stay to enjoy the seasons of Wisconsin, it's truly amazing!",
    price: 487,
  },
  {
    ownerId: 4,
    address: "29 Coldsprings Drive",
    city: "Denver",
    state: "Colorado",
    country: "United States of America",
    lat: 76,
    lng: -139,
    name: "Cabin",
    description:
      "Great place to stay for skiing, come by and don't miss the experience!",
    price: 240,
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
