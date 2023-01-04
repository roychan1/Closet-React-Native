const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: String
});

const postSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: [tagSchema],
    image: {
        data: Buffer,
        contentType: String
    },
    timestamp: Number
});

mongoose.model('Post', postSchema);