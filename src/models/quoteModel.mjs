import { DataTypes, UUIDV4 } from 'sequelize';
import { sequelize } from '../db/connectionDB.mjs';
import File from './fileModel.mjs';

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  originalText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cleanedText: {
    type: DataTypes.TEXT
  },
  speaker: {
    type: DataTypes.STRING
  },
  position: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  subcategory: {
    type: DataTypes.STRING
  },
  confidence: {
    type: DataTypes.FLOAT
  },
  embedding: {
    type: DataTypes.ARRAY(DataTypes.FLOAT), 
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Quote.belongsTo(File, { foreignKey: 'fileId', onDelete: 'CASCADE' });
File.hasMany(Quote, { foreignKey: 'fileId' });

export default Quote;
