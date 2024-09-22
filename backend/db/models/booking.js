"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
    }
  }
  Booking.init(
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          cannotBeBeforeNow(value) {
            if (value.getTime() < Date.now()) {
              throw new Error("Start date cannot be in the past!");
            }
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          cannotBeBeforeStartDate(value) {
            if (value.getTime() < this.startDate.getTime()) {
              throw new Error("End date cannot be before start date!");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
