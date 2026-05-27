import express from 'express';
import { getTrades, getTrade, addTrade, updateTrade, deleteTrade, syncTrades } from '../controllers/tradeController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/sync')
  .post(protect, syncTrades);

router.route('/')
  .get(protect, getTrades)
  .post(protect, upload.single('screenshot'), addTrade);

router.route('/:id')
  .get(protect, getTrade)
  .put(protect, upload.single('screenshot'), updateTrade)
  .delete(protect, deleteTrade);

export default router;
