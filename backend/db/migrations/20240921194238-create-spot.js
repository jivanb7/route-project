"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        address: {
          type: Sequelize.STRING,
          allowNull: false,
          isAlphanumeric: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
          isAlpha: true,
        },
        state: {
          type: Sequelize.STRING,
          len: [1, 20],
          isAlpha: true,
        },
        country: {
          type: Sequelize.STRING,
          allowNull: false,
          isAlpha: true,
        },
        lat: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        lng: {
          type: Sequelize.DECIMAL,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          len: [1, 30],
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
          len: [1, 300],
        },
        price: {
          type: Sequelize.DECIMAL,
          allowNull: false,
          min: 0,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  },
};
