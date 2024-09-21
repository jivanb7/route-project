"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });
    }
  }
  Spot.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          isCapitalized(value) {
            const addyArray = value.split(" ");
            for (let addy of addyArray) {
              if (addy[0].toUpperCase() !== addy[0]) {
                throw new Error("Names in address must be capitalized");
              }
            }
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          isCapitalized(value) {
            const cityNames = value.split(" ");
            for (let cityName of cityNames) {
              if (cityName[0].toUpperCase() !== cityName[0]) {
                throw new Error("City names must be capitalized");
              }
            }
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 20],
          isAlpha: true,
          isCapitalized(value) {
            const stateNames = value.split(" ");
            for (let stateName of stateNames) {
              if (stateName[0].toUpperCase() !== stateName[0]) {
                throw new Error("State names must be capitalized");
              }
            }
          },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          isCapitalized(value) {
            const countryNames = value.split(" ");
            for (let countryName of countryNames) {
              if (
                countryName !== "of" &&
                countryName[0].toUpperCase() !== countryName[0]
              ) {
                throw new Error("Country names must be capitalized");
              }
            }
          },
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 300] },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
    },
    {
      indexes: [
        // Create a unique index for full addresses
        {
          unique: true,
          fields: ["address", "city", "state", "country"],
        },
      ],
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};

//  await queryInterface.addColumn(options, "ownerId", {
//    type: Sequelize.INTEGER,
//    allowNull: false,
//    references: { model: "Users" },
//    onDelete: "CASCADE",
//  });
