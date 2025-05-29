import express from "express";
import UploadController from "../controllers/uploadController.mjs";
import jwtMiddleware from '../middleware/jwtMiddleware.mjs';
import upload from "../middleware/uploadMiddleware.mjs";

const router = express.Router();

router.post("/upload", jwtMiddleware, upload.array("documents", 10), UploadController.uploadDocsController);

export default router;
