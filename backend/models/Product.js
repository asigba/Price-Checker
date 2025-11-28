import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
    price: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true  // Prevent duplicate URLs
  },
  price: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  priceHistory: [priceHistorySchema],
  lastChecked: {
    type: Date,
    default: Date.now
  },
  alertEnabled: {
    type: Boolean,
    default: true
  },
  targetPrice: {
    type: Number,
    default: null
  },
  alerts: [
    {
      message: String,
      oldPrice: String,
      newPrice: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

export default mongoose.model('Product', productSchema);