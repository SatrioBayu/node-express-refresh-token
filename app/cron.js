const CronJob = require("cron").CronJob;
const { InvalidToken } = require("../app/models");

const clearInvalidTokenTableJob = new CronJob("0 0 * * * *", async () => {
  // your code to clear the table goes here
  try {
    await InvalidToken.destroy({
      truncate: true,
    });
    console.log("Table cleared");
  } catch (error) {
    console.error("Error clearing table:", error);
  }
});

module.exports = { clearInvalidTokenTableJob };
