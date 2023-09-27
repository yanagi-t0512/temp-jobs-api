const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  company: {
    type:String,
    required:[true, '会社名の入力は必須です'],
    maxlength: 50
  },
  position: {
    type:String,
    required:[true, 'ポジションの入力は必須です'],
    maxlength: 50
  },
  status: {
    type:String,
    enum:['interview', 'declined', 'pending'],
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'ユーザーは必須です'],
  }
}, {timestamps: true})


module.exports = mongoose.model('Job', JobSchema)