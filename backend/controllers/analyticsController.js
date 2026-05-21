import Trade from '../models/Trade.js';

// @desc    Get dashboard analytics
// @route   GET /api/v1/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user.id, status: { $in: ['Win', 'Loss', 'Breakeven'] } });

    const totalTrades = trades.length;
    let wins = 0;
    let losses = 0;
    let breakeven = 0;
    let totalPnL = 0;

    trades.forEach(trade => {
      if (trade.status === 'Win') wins++;
      if (trade.status === 'Loss') losses++;
      if (trade.status === 'Breakeven') breakeven++;
      if (trade.pnl) totalPnL += trade.pnl;
    });

    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : 0;
    const lossRate = totalTrades > 0 ? ((losses / totalTrades) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTrades,
        wins,
        losses,
        breakeven,
        winRate,
        lossRate,
        netPnL: totalPnL,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
