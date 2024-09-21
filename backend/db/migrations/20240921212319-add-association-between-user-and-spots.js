"use strict";

let options = {};
options.tableName = "Spots";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(options, "ownerId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Users" },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, "ownerId");
  },
};
