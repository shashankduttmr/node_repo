const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:process.env.cloudname,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

const Storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'node20'
    }
})


module.exports = {
    Storage,
    cloudinary
}
