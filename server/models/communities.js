// Community Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitiesSchema = new Schema({
    name: {type: String, maxLength: 100, required: true},
    description: {type: String, maxLength: 500, required: true},
    postIDs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    startDate: {type: Date, default: () => Date.now},
    members: [String]
});

communitiesSchema.virtual('url').get(function () {
    return 'communities/' + this._id;
});

communitiesSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

module.exports = mongoose.model('Community', communitiesSchema);