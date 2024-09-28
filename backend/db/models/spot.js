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
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique-address",
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique-address",
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique-address",
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
