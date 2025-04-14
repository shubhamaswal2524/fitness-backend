import { DataTypes } from "sequelize";
import db from "../config/db.config";

export const Users = db.sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  membership_type: {
    type: DataTypes.ENUM("Basic", "Standard", "Premium"),
    allowNull: false,
    defaultValue: "Basic",
  },
  membership_start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  membership_end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  emergency_contact_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emergency_contact_phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profile_picture: {
    type: DataTypes.STRING, // Store image URL or file path
    allowNull: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  fitness_goal: {
    type: DataTypes.STRING, // Example: "Weight Loss", "Muscle Gain", "Endurance"
    allowNull: true,
  },
  workout_preferences: {
    type: DataTypes.STRING, // Example: "Cardio", "Strength Training", "Yoga"
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

export default Users;
