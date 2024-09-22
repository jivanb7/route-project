"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          cannotBePastDate(value) {
            const currentDate = new Date();
            console.log("date value passed in: ", value);
            console.log("current date: ", currentDate);
          },
        },
      },
      endDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
