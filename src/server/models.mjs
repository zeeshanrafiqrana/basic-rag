import { sequelize } from "../db/connectionDB.mjs";
import QuoteModel from "../models/quoteModel.mjs";
import FileModel from "../models/fileModel.mjs";
import ConversationModel from "../models/conversationModel.mjs";

const db = {}

db.sequelize = sequelize;
db.Sequelize = sequelize.Sequelize;
db.QuoteModel = QuoteModel;
db.FileModel = FileModel;
db.ConversationModel = ConversationModel;

export default db;
