import express from 'express';
import SearchController from '../controllers/searchController.mjs';

const router = express.Router();

router.post('/search', SearchController.searchQuotes);

export default router;
