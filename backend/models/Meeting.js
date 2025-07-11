const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const meetingSchema = new Schema({
  name: String,
  agent: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'agent'
  },
  userId: String,
  status : {
    type: String,
    enum: ['not_started', 'in_progress','completed'],
    default: 'not_started',
  },
  transcribed_url : String,
  recording_url : String 
});


const Meeting = mongoose.model('meeting', meetingSchema);

module.exports = Meeting