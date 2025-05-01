import { DataTypes } from "sequelize";
import db from "../config/db.config";
import { Workouts } from "./workouts.model";
import Users from "./user.model";

export const UserWorkoutSessions = db.sequelize.define(
  "user_workout_sessions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    workout_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "workouts",
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
    },
    day: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    session_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "skipped"),
      defaultValue: "pending",
    },
    time_taken_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logged_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }
);

UserWorkoutSessions.belongsTo(Users, { foreignKey: "user_id", as: "user" });
UserWorkoutSessions.belongsTo(Workouts, {
  foreignKey: "workout_id",
  as: "workout",
});
