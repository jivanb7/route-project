let options = {};
options.tableName = "Bookings";
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(options, "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Users" },
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn(options, "spotId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "Spots" },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(options, "userId");
    await queryInterface.removeColumn(options, "spotId");
  },
};
