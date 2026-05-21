import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a goal title'],
      trim: true,
    },
    target: {
      type: Number,
      required: [true, 'Please add a target value'],
    },
    progress: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please specify a unit (e.g. $, %, trades)'],
    },
    done: {
      type: Boolean,
      default: false,
    },
    iconName: {
      type: String,
      default: 'Target', // stores the Lucide icon name as string
    }
  },
  {
    timestamps: true,
  }
);

// Auto-update 'done' status based on progress
GoalSchema.pre('save', function () {
  if (this.progress >= this.target && this.target > 0) {
    this.done = true;
  } else if (this.progress < this.target) {
    this.done = false;
  }
});

export default mongoose.model('Goal', GoalSchema);
