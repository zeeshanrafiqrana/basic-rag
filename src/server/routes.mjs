import UploadRoutes from "../routes/uploadRoutes.mjs";
import SearchRoutes from "../routes/searchRoutes.mjs";
import ConversationRoutes from "../routes/conversationRoutes.mjs";
import { app } from "./serverApp.mjs";

app.use("/api", UploadRoutes);
app.use("/api", SearchRoutes);
app.use("/api", ConversationRoutes);

export { app };
