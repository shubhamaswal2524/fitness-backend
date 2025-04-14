import { DataTypes } from "sequelize";
import db from "../config/db.config";

export const Media = db.sequelize.define("media", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  media_type: {
    type: DataTypes.ENUM("image", "video"),
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING, // File URL or file path in the server
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING, // Name of the file (optional)
    allowNull: true,
  },
  file_size: {
    type: DataTypes.INTEGER, // Size of the file in bytes (optional)
    allowNull: true,
  },
  thumbnail_path: {
    type: DataTypes.STRING, // Optional thumbnail path for videos or images
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING, // A short description or title for the media
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

export default Media;
