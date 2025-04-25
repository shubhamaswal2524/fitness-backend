import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Initialize Sequelize with environment variables

console.log(
  "first======",
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string
);
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Disable logging for cleaner console output

    dialectOptions: {
      connectTimeout: 60000, // Set connection timeout to 60 seconds
    },

    define: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      // underscored: true, // Uncomment if you want snake_case column names
    },

    pool: {
      max: 5, // Maximum number of connections in pool
      min: 0, // Minimum number of connections
      idle: 1000, // Connection idle time before release (in ms)
      acquire: 60000, // Maximum time (in ms) a connection can be idle before being released
    },
  }
);

// Sync database models (Ensure tables exist)
sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log("Database connected and synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// Create a database object to export
const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

export default db;
