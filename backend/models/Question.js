const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: [true, 'Level number is required'],
      min: [1, 'Level must be at least 1'],
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Question image URL is required'],
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (v) {
          return v && v.length >= 3 && v.length <= 4;
        },
        message: 'Question must have 3-4 options',
      },
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      validate: {
        validator: function (v) {
          return this.options && this.options.includes(v);
        },
        message: 'Correct answer must be one of the options',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);