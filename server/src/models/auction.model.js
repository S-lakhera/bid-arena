import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image: {
      type: String,
      default: 'no-image.jpg',
    },
    startBid: {
      type: Number,
      required: [true, 'Please add a starting bid'],
      min: 0,
    },
    currentHighestBid: {
      type: Number,
      default: 0,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed', 'paid'],
      default: 'upcoming',
    },
    startTime: {
      type: Date,
      required: [true, 'Please add a start time'],
    },
    duration: {
      type: Number, // duration in milliseconds or seconds
      required: [true, 'Please add a duration'],
    },
    endTime: {
      type: Date,
      required: true,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Before saving, ensure endTime is calculated if not explicitly set
auctionSchema.pre('validate', function(next) {
  if (this.startTime && this.duration && !this.endTime) {
    this.endTime = new Date(this.startTime.getTime() + this.duration);
  }
  next();
});

const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;
