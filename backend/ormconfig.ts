module.exports = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: "shareit",
  password: "shareit",
  database: "shareit3",
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
};
