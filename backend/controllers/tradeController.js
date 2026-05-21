import Trade from '../models/Trade.js';

// @desc    Get all trades for user
// @route   GET /api/v1/trades
// @access  Private
export const getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: trades.length, data: trades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single trade
// @route   GET /api/v1/trades/:id
// @access  Private
export const getTrade = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.user.id });
    if (!trade) {
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }
    res.status(200).json({ success: true, data: trade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new trade
// @route   POST /api/v1/trades
// @access  Private
export const addTrade = async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    // Auto calculate PNL if exit price exists
    if (req.body.exitPrice && req.body.entryPrice && req.body.quantity) {
      const pnl = req.body.direction === 'Long' 
        ? (req.body.exitPrice - req.body.entryPrice) * req.body.quantity 
        : (req.body.entryPrice - req.body.exitPrice) * req.body.quantity;
      req.body.pnl = pnl;
    }

    if (req.file) {
      req.body.screenshot = req.file.path;
    }

    const trade = await Trade.create(req.body);
    res.status(201).json({ success: true, data: trade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update trade
// @route   PUT /api/v1/trades/:id
// @access  Private
export const updateTrade = async (req, res) => {
  try {
    let trade = await Trade.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!trade) {
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }

    if (req.file) {
      req.body.screenshot = req.file.path;
    }

    trade = await Trade.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: trade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete trade
// @route   DELETE /api/v1/trades/:id
// @access  Private
export const deleteTrade = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!trade) {
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }

    await trade.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
