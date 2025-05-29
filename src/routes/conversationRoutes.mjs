import express from 'express';
import jwtMiddleware from '../middleware/jwtMiddleware.mjs';
import ConversationController from '../controllers/conversationController.mjs';

const router = express.Router();

router.post('/conversations', jwtMiddleware, ConversationController.createConversation);
router.get('/conversations', jwtMiddleware, ConversationController.getAllConversations);

export default router;