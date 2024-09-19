"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const seedData = [
  {
    email: "demo@user.io",
    username: "Demo-lition",
    hashedPassword: bcrypt.hashSync("password"),
  },
  {
    email: "user1@user.io",
    username: "FakeUser1",
    hashedPassword: bcrypt.hashSync("password2"),
  },
  {
    email: "user2@user.io",
    username: "FakeUser2",
    hashedPassword: bcrypt.hashSync("password3"),
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(seedData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: seedData.map((user) => {
            return user.username;
          }),
        },
      },
      {}
    );
  },
};
