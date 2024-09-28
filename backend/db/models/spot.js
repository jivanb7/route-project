"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });

      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  Spot.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique-address",
        validate: {
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
        unique: "unique-address",
        validate: {
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
        allowNull: false,
        unique: "unique-address",
        validate: {
          len: [1, 20],
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
        unique: "unique-address",
        validate: {
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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          withinRange(val) {
            if (typeof val !== "number" || val < -90 || val > 90) {
              throw new Error("Latitude must be within -90 and 90");
            }
          },
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          withinRange(val) {
            if (typeof val !== "number" || val < -180 || val > 180) {
              throw new Error("Longitude must be within -180 and 180");
            }
          },
        },
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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
          isNumber(val) {
            if (typeof val !== "number" || val < 0) {
              throw new Error("Price per day must be a positive number");
            }
          },
        },
      },
    },
    {
      indexes: [
        // Create a unique index for full addresses
        {
          unique: true,
          name: "unique-address",
          fields: ["address", "city", "state", "country"],
        },
      ],
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
