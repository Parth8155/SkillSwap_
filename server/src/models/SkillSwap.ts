import mongoose, { Schema } from 'mongoose';
import { ISkillSwap } from '../types';

const skillSwapSchema = new Schema<ISkillSwap>({
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // Only required when not a public swap
    required: function(this: any) {
      return !this.isPublic;
    }
  },
  skillOffered: {
    type: Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill offered is required']
  },
  skillWanted: {
    type: Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Skill wanted is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  sessionDate: {
    type: Date
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot exceed 500 characters']
  },
  // Public swaps visible to all users
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
skillSwapSchema.index({ requester: 1 });
skillSwapSchema.index({ provider: 1 });
skillSwapSchema.index({ status: 1 });
skillSwapSchema.index({ createdAt: -1 });

export default mongoose.model<ISkillSwap>('SkillSwap', skillSwapSchema);
