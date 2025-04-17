// Comment Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    content: {type: String, required: true, maxLength: 500},
    commentIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    commentedBy: {type: String, required: true},
    commentedDate: {type: Date, default: () => Date.now()}
});

commentsSchema.virtual('url').get(function() {
    return 'comments/' + this._id;
});

module.exports = mongoose.model('Comment', commentsSchema);