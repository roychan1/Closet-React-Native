const express = require('express');
const {uploadImage} = require('../../helpers/helpers');

const router = express.Router();

router.post('/upload', async (req, res, next) => {
    console.log(req.body.file)
    try {
        const myFile = req.file
        const imageUrl = await uploadImage(myFile)
        res.status(200).json({
            message: 'Upload was successful',
            data: imageUrl,
        })
    } catch(error) {
        next(error)
    }
});

module.exports = router;