"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await Promise.all([
      queryInterface.addColumn("Users", "photo_profile", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("Users", "photo_public_id", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
    // await queryInterface.addColumns("Users", {
    //   photo_profile: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //   },
    //   photo_public_id: {
    //     type: Sequelize.STRING,
    //     allowNull: true,
    //   },
    // });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await Promise.all([queryInterface.removeColumn("Users", "photo_profile"), queryInterface.removeColumn("Users", "photo_public_id")]);
    // await queryInterface.removeColumns("Users", ["photo_profile", "photo_public_id"]);
  },
};
