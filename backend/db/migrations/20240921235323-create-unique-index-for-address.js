"use strict";

let options = {};
options.tableName = "Spots";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(options, {
      unique: true,
      fields: ["address", "city", "state", "country"],
      name: "unique-address",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(options, "unique-address");
  },
};
