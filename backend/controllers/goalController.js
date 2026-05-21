import Goal from '../models/Goal.js';

// @desc    Get goals
// @route   GET /api/v1/goals
// @access  Private
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set goal
// @route   POST /api/v1/goals
// @access  Private
export const addGoal = async (req, res) => {
  try {
    const { title, target, unit, iconName } = req.body;

    if (!title || !target || !unit) {
      return res.status(400).json({ success: false, message: 'Please add title, target, and unit' });
    }

    const goal = await Goal.create({
      title,
      target,
      unit,
      iconName: iconName || 'Target',
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/v1/goals/:id
// @access  Private
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check for user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    // Save to trigger pre-save hook for 'done' status
    await updatedGoal.save();

    res.status(200).json({ success: true, data: updatedGoal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/v1/goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check for user
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    await goal.deleteOne();

    res.status(200).json({ success: true, id: req.params.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
