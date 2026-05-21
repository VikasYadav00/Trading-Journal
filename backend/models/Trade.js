import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  tradeTitle: String,
  tradeType: {
    type: String,
    enum: ['Day Trade', 'Swing Trade', 'Scalp', 'Position'],
  },
  asset: String, // Currency Pair / Stock / Crypto / Index
  marketCategory: {
    type: String,
    enum: ['Forex', 'Crypto', 'Stocks', 'Indices', 'Commodities', 'Other'],
  },
  direction: {
    type: String,
    enum: ['Long', 'Short'],
    required: true,
  },
  entryPrice: {
    type: Number,
    required: true,
  },
  exitPrice: {
    type: Number,
  },
  stopLoss: Number,
  takeProfit: Number,
  quantity: { // Lot Size
    type: Number,
    required: true,
    min: 0.001,
  },
  riskAmount: Number,
  rewardAmount: Number,
  riskRewardRatio: Number,
  commission: {
    type: Number,
    default: 0,
  },
  leverage: {
    type: Number,
    default: 1,
  },
  strategyUsed: String,
  setupType: String,
  timeframe: String,
  status: {
    type: String,
    enum: ['Open', 'Win', 'Loss', 'Breakeven'],
    default: 'Open',
  },
  // Dates and Times
  entryDate: {
    type: Date,
    required: true,
  },
  exitDate: Date,
  entryTime: String,
  exitTime: String,
  tradeDuration: String, // Calculated or string

  // Psychology
  mindsetBefore: String,
  emotionalState: String,
  confidenceLevel: {
    type: Number,
    min: 1,
    max: 10,
  },
  disciplineRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  mistakesMade: String,
  lessonsLearned: String,
  notes: String,

  // Images
  beforeImage: String,
  afterImage: String,

  // Calculated
  pnl: Number,
  pnlPercentage: Number,

}, {
  timestamps: true
});

export default mongoose.model('Trade', TradeSchema);
