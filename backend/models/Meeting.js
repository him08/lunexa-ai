const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const meetingSchema = new Schema({
  name: String,
  agent: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'agent'
  }
});


const Meeting = mongoose.model('meeting', meetingSchema);

module.exports = Meeting