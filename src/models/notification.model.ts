import { DataTypes } from "sequelize";
import db from "../config/db.config";
import Users from "./user.model";

export const Notifications = db.sequelize.define("notifications", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  media_url: {
    type: DataTypes.STRING, // Can be image, video, PDF, etc.
    allowNull: true,
  },
  media_type: {
    type: DataTypes.ENUM("image", "video", "link", "none"),
    defaultValue: "none",
  },
  target_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // NULL means it's for all users
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "SET NULL",
  },
  is_global: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
