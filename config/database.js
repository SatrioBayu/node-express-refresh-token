require("dotenv").config();

const { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } = process.env;

module.exports = {
  development: {
    username: "postgres",
    password: "Makoto123",
    database: "sts",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "Makoto123",
    database: "sts",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    host: PGHOST,
    port: PGPORT,
    dialect: "postgres",
  },
};
