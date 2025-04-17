// LinkFlair Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkflairsSchema = new Schema({
    content: {type: String, maxLength: 30}
})

linkflairsSchema.virtual('url').get(function () {
    return 'linkFlairs/' + this._id;
});

module.exports = mongoose.model('LinkFlair', linkflairsSchema)