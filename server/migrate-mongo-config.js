require("dotenv").config();

module.exports = {
  mongodb: {
    url: process?.env?.MONGO_URL,
    databaseName: process?.env?.MONGO_DB,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: "src/db/migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};
