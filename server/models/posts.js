// Post Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    title: {type: String, required: true, maxLength: 100},
    content: String,
    linkFlairID: {type: Schema.Types.ObjectId, ref: 'LinkFlair'},
    postedBy: String,
    postedDate: {type: Date, default: () => Date.now()},
    commentIDs: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    views: {type: Number, default: 0}
});

PostsSchema.virtual('url').get(function () {
    return 'posts/' + this.__id;
});

module.exports = mongoose.model('Post', PostsSchema);