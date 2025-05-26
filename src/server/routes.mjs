import UploadRoutes from "../routes/uploadRoutes.mjs";
import { app } from "./serverApp.mjs";

app.use("/api", UploadRoutes);

export { app };
