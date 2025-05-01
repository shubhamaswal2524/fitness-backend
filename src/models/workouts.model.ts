import { DataTypes } from "sequelize";
import db from "../config/db.config";
import { UserWorkoutSessions } from "./user_workout_sessions.model";

export const Workouts = db.sequelize.define("workouts", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING, // e.g., ChestPresses
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("push", "pull", "legs", "other"),
    allowNull: false,
  },
  body_part: {
    type: DataTypes.STRING, // e.g., Chest, Shoulders, Triceps
    allowNull: false,
  },
  muscle_targeted: {
    type: DataTypes.STRING, // e.g., Upper Chest, Side Delts
    allowNull: false,
  },
  equipment: {
    type: DataTypes.STRING, // e.g., Barbell, Dumbbell, Cable
    allowNull: true,
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Workouts.hasMany(UserWorkoutSessions, {
//   foreignKey: "workout_id",
//   as: "user_sessions",
// });
