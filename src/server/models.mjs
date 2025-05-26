import { sequelize } from "../db/connectionDB.mjs";
import QuoteModel from "../models/quoteModel.mjs";
import FileModel from "../models/fileModel.mjs";

const db = {}

db.sequelize = sequelize;
db.Sequelize = sequelize.Sequelize;
db.QuoteModel = QuoteModel;
db.FileModel = FileModel;

export default db;
