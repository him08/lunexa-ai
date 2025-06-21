const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const agentSchema = new Schema({
  avatar:String,
  name: String,
  instructions: String,
});


const Agent = mongoose.model('agent', agentSchema);

module.exports = Agent