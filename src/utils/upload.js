const multer = require("multer")
const path = require("path")
const { HttpException } = require('./http-exception')
const { StatusCodes } = require('http-status-codes')

const chekFileType = (req,file , cb)=> {
	const fileTypes = /jpeg|png|jpg|mp4|mp3|mov|avi/
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
	const mimetype = fileTypes.test(file.mimetype)
  if(extname && mimetype) {
		return cb(null , true)
	}
	else {
		cb (
			new HttpException(StatusCodes.NOT_FOUND,"This file type is invalid.")
		)
	}
}

const upload = multer({
  storage:multer.memoryStorage(),
	limits:{fileSize:50*1024*1024},
	fileFilter(req,file,cb) {
		chekFileType(req,file,cb)
	}
})

module.exports = {upload}











