import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware.mjs';
import SearchController from '../controllers/searchController.mjs';

const router = express.Router();

router.post('/search/:conversationId',jwtMiddleware, SearchController.askAboutFile);

export default router;
