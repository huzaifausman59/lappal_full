import express from 'express';
import { getAIResponse } from '../controllers/aiController.js';

const router = express.Router();

router.post('/response', getAIResponse);

export default router;