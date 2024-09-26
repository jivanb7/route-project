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
    firstName: "John",
    lastName: "Smith",
    hashedPassword: bcrypt.hashSync("password"),
  },
  {
    email: "user1@user.io",
    username: "FakeUser1",
    firstName: "Mary",
    lastName: "Poppins",
    hashedPassword: bcrypt.hashSync("password2"),
  },
  {
    email: "user2@user.io",
    username: "FakeUser2",
    firstName: "Harry",
    lastName: "Potter",
    hashedPassword: bcrypt.hashSync("password3"),
  },
  {
    email: "hsimp123@springfield.com",
    username: "Hsimpson123",
    firstName: "Homer",
    lastName: "Simpson",
    hashedPassword: bcrypt.hashSync("donutLover123"),
  },
  {
    email: "bsimp00@gmail.com",
    username: "Bart00",
    firstName: "Bart",
    lastName: "Simpson",
    hashedPassword: bcrypt.hashSync("danger00"),
  },
  {
    email: "pgriffin@printing.com",
    username: "pgriffin5",
    firstName: "Peter",
    lastName: "Griffin",
    hashedPassword: bcrypt.hashSync("house5"),
  },
  {
    email: "joeswan@hospital.com",
    username: "joeswanson8",
    firstName: "Joe",
    lastName: "Swanson",
    hashedPassword: bcrypt.hashSync("legshurt22"),
  },
  {
    email: "anakins88@yahoo.com",
    username: "anakinsky1",
    firstName: "Anakin",
    lastName: "Skywalker",
    hashedPassword: bcrypt.hashSync("darthvader"),
  },
  {
    email: "obilight@aol.com",
    username: "obiwan4",
    firstName: "Obiwan",
    lastName: "Kenobi",
    hashedPassword: bcrypt.hashSync("destroysith"),
  },
  {
    email: "jivan123@facebook.com",
    username: "jivan1000",
    firstName: "Jivan",
    lastName: "Skywalker",
    hashedPassword: bcrypt.hashSync("darkside"),
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
