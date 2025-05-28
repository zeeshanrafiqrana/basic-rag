import UploadRoutes from "../routes/uploadRoutes.mjs";
import SearchRoutes from "../routes/searchRoutes.mjs";
import { app } from "./serverApp.mjs";

app.use("/api", UploadRoutes);
app.use("/api", SearchRoutes);

export { app };
