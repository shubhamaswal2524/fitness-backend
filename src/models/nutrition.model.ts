import { DataTypes } from "sequelize";
import db from "../config/db.config";

export const DietAndNutrition = db.sequelize.define("diet_and_nutrition", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  plan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  target_goals: {
    type: DataTypes.STRING, // E.g., "Weight Loss", "Muscle Gain", "Maintenance"
    allowNull: false,
  },
  calories_per_day: {
    type: DataTypes.INTEGER, // Daily calorie intake
    allowNull: true,
  },
  meal_frequency: {
    type: DataTypes.INTEGER, // Number of meals per day
    allowNull: true,
  },
  meal_plan: {
    type: DataTypes.JSON, // JSON to store meal plans for each day (e.g. breakfast, lunch, dinner)
    allowNull: true,
  },
  nutrients: {
    type: DataTypes.JSON, // Store the nutritional data (protein, carbs, fats, etc.) for the diet plan
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default DietAndNutrition;
