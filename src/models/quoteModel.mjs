import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connectionDB.mjs';
import File from './fileModel.mjs';
import Conversation from './conversationModel.mjs';

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  originalText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cleanedText: DataTypes.TEXT,
  speaker: DataTypes.STRING,
  position: DataTypes.INTEGER,
  status: DataTypes.STRING,
  category: DataTypes.STRING,
  subcategory: DataTypes.STRING,
  confidence: DataTypes.FLOAT,
  embedding: {
    type: DataTypes.ARRAY(DataTypes.FLOAT),
    allowNull: true,
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Conversation',
      key: 'id',
    },
  },
  fileId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'File',
      key: 'id',
    },
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
  tableName: 'Quote',
  timestamps: true,
  freezeTableName: true,
});

Quote.belongsTo(File, { foreignKey: 'fileId', onDelete: 'CASCADE' });
File.hasMany(Quote, { foreignKey: 'fileId' });

Quote.belongsTo(Conversation, { foreignKey: 'conversationId', onDelete: 'SET NULL' });
Conversation.hasMany(Quote, { foreignKey: 'conversationId' });

export default Quote;
