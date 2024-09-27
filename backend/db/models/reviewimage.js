"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
      });
    }
  }
  ReviewImage.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
          len: [1, 150],
        },
      },
    },
    {
      sequelize,
      modelName: "ReviewImage",
    }
  );
  return ReviewImage;
};
