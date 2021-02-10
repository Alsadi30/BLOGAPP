const multer = require('multer')
const path = require('path')
// this line is for comment
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null,file.fieldname + '-' + Date.now() + '-' + filename)
    }
})

const upload = multer({
    storage, limits: {
        fileSize:1024*1024*5
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|gif/
        const extname = types.test(path.extname(file.originalname).toLowerCase)
        const mimeType = types.test(file.mimetype)

        if (extname && mimetype) {
            cb(null,true)
        } else {
            cb(new Error('Only Support Images'))
        }

    }
})

module.exports = upload