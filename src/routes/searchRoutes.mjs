import express from 'express';
import SearchController from '../controllers/searchController.mjs';

const router = express.Router();

router.post('/search/:conversationId', SearchController.askAboutFile);

export default router;
