import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectionDB.mjs';

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'New Conversation',
  },
  messages: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    defaultValue: [],
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Conversation',
  timestamps: true,
  freezeTableName: true,
});

export default Conversation;
