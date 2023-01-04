const util = require('util');
const gc = require('../config/');
const bucket = gc.bucket('closet_app_images');

// const uploadImage = (file) => {
//     return new Promise((resolve, reject) => {
//         const { originalName, buffer } = file

//         const blob = bucket.file(originalName.replace(/ /g, '_'))
//         const blobStream = blob.createWriteStream({
//             resumable: false
//         })
//         blobStream.on('finish', () => {
//             const publicUrl = format(
//                 `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//             )

//             resolve(publicUrl)
//         })
//         .on('error', () => {
//             reject(`Unable to upload image, something went wrong`)
//         })
//         .end(buffer)
//     })
// }

module.exports = function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const { originalname, buffer } = file
    
        const blob = bucket.file(originalname.replace(/ /g, "_"))
        const blobStream = blob.createWriteStream({
        resumable: false
        })
    
        blobStream.on('finish', () => {
        const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        )
        resolve(publicUrl)
        })
        .on('error', () => {
        reject(`Unable to upload image, something went wrong`)
        })
        .end(buffer)
    
    })
}

// module.exports = uploadImage;