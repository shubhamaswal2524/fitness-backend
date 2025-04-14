// import "../env"; // Load environment variables
import db from "./config/db.config";
import Server from "./server";
import routes from "./router/routes";
import dotenv from "dotenv";

dotenv.config();
console.log(
  "ENV VARIABLES LOADED:",
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS
); // Debug

(async () => {
  try {
    await db.sequelize.sync(); // Ensure database is synchronized
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
})();

const port = parseInt(process.env.PORT || "8000", 10); // Ensure PORT is parsed as an integer
export default new Server().router(routes);
