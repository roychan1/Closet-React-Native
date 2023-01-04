const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/addpost', async(req, res) => {
    const { userID, tags, image, timestamp } = req.body;
    let decoded_userID

    jwt.verify(userID, 'MY_SECRET_KEY', (error, decoded) => {
        if (error) {
            return res.status(422).send(err.message);
        } else {
            decoded_userID = decoded.userID;
        }
    })

    try {
        // TODO: get the data needed to make post object

        const post = new Post({userID: decoded_userID, tags, image, timestamp});
        console.log(image);
        await post.save()
        .then(function(response) {
            console.log(response);
        });
    } catch (err) {
        return res.status(422).send(err.message);
    }
})

module.exports = router;