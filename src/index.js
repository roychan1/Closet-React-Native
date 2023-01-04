// TODO:
// - upload image in chunks?
// - refactor image upload parts

require('./models/User');
require('./models/Post');

const fs = require('fs')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');   // for gcs
// const {uploadImage} = require('../helpers/helpers');  // for gcs
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
// const imageRoutes = require('./routes/imageRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

// for gcs
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        // 20mb or less
        fileSize: 20 * 1024 * 1024,
    },
})

app.disable('x-powered-by');    // for gcs
app.use(multerMid.single('file'));  // for gcs
// app.use('/upload', bodyParser.raw({type: '*/*', limit: '20mb'}));       // for gcs image upload
const rawParser = bodyParser.raw({type: '*/*', limit: '20mb'});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  // for gcs
app.use(authRoutes);
app.use(postRoutes);
// app.use(imageRoutes);

//
const gc = require('../config/');
const bucket = gc.bucket('closet_app_images');
const uploadImage = (file) => new Promise((resolve, reject) => {
    // const { originalname, buffer } = file
    // const buffer = file
    const originalname = 'image_12345'

    // console.log(file)

    const remoteFile = bucket.file(originalname.replace(/ /g, "_"))

    // fs.createWriteStream(file).pipe(remoteFile.createWriteStream())
    // .on('error', (error) => {
    //     console.log(error)
    //     reject(error)
    // })
    // .on('finish', (response) => {
    //     console.log(response)
    //     resolve(`https://storage.googleapis.com/${bucket.name}/${originalname}`)
    // })

    const blobStream = remoteFile.createWriteStream({
      resumable: false,
      metadata: {
        contentType: 'image/jpeg'
      }
    })
  
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${originalname}`
      resolve(publicUrl)
    })
    .on('error', (error) => {
        console.log(error)
        reject(`Unable to upload image, something went wrong`)
    })
    .end(new Buffer.from(file, 'base64'))
  
  })


app.post('/upload', rawParser, async(req, res) => {
    // should read image raw file from req.body
    try {
        console.log("_____________________________")
        
        // console.log("header: " + req.headers['content-type'])
        // const myFile = JSON.parse(req.body).image_base64
        // console.log("file:" + JSON.parse(req.body).image_base64)
        const imageUrl = await uploadImage(JSON.parse(req.body).image_base64)
        .then(function(response) {
            console.log(response)
        })
        .catch(function(error) {
            console.log(error)
        })
        res.status(200).json({
            message: 'Upload was successful',
            data: imageUrl,
        })
    } catch(error) {
        // next(error)
    }
});
// app.use((err, req, res, next) => {
//     res.status(500).json({
//         error: err,
//         message: 'Internal server error!!!!!',
//     })

//     next()
// })

const mongoUri = 'mongodb+srv://roychan:215M0ng0DB@cluster0.wt2ea.mongodb.net/?retryWrites=true&w=majority'

if (!mongoUri) {
    throw new Error(
        `MongoURI was not supplied.`
    );
}

mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
    console.log("Connected to mongo instance.");
})
mongoose.connection.on('error', (err) => {
    console.error("Error connecting to mongo", err);
})

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
})

app.listen(3000, () => {
    console.log("Listening on port 3000. (Mongo + GCS)");
})