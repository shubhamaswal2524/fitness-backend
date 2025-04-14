import { DataTypes } from "sequelize";
import db from "../config/db.config";

export const Meetings = db.sequelize.define("meetings", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  meeting_title: {
    type: DataTypes.STRING, // Title of the meeting (e.g., "Yoga Class", "Fitness Consultation")
    allowNull: false,
  },
  meeting_link: {
    type: DataTypes.STRING, // Link to the meeting (e.g., Zoom, Google Meet, etc.)
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING, // Description of the meeting (e.g., "Join us for a workout session")
    allowNull: true,
  },
  meeting_date: {
    type: DataTypes.DATE, // Date and time of the meeting
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER, // Duration of the meeting in minutes (optional)
    allowNull: true,
  },
  related_id: {
    type: DataTypes.INTEGER, // Foreign key to link the meeting to a user, workout plan, etc.
    allowNull: true,
  },
  related_model: {
    type: DataTypes.STRING, // The model related to the meeting (e.g., "User", "WorkoutPlan")
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

export default Meetings;
