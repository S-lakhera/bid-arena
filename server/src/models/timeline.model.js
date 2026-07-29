import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auction',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        'created',
        'started',
        'bid_placed',
        'extended',
        'completed',
        'payment_success',
        'payment_failed',
      ],
      required: true,
    },
    eventData: {
      type: mongoose.Schema.Types.Mixed,
      description: 'Flexible field to store event-specific details (e.g., bid amount, winner info, reason for extension)',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Timeline = mongoose.model('Timeline', timelineSchema);
export default Timeline;
