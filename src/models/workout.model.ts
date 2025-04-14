import { DataTypes } from "sequelize";
import db from "../config/db.config";

export const WorkoutPlans = db.sequelize.define("workout_plans", {
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
  workout_type: {
    type: DataTypes.ENUM(
      "Strength Training",
      "Cardio",
      "HIIT",
      "Yoga",
      "Mixed"
    ),
    allowNull: false,
  },
  intensity: {
    type: DataTypes.ENUM("Low", "Medium", "High"),
    allowNull: false,
  },
  frequency_per_week: {
    type: DataTypes.INTEGER, // Number of days per week the workout plan should be followed
    allowNull: false,
  },
  duration_per_session: {
    type: DataTypes.INTEGER, // Duration in minutes (e.g., 45 minutes, 60 minutes)
    allowNull: true,
  },
  exercises: {
    type: DataTypes.JSON, // List of exercises for the plan, stored in JSON format
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

export default WorkoutPlans;
