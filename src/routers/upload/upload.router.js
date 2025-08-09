const {Router} = require('express')
const { UploadController } = require('../../controllers/upload/upload.controller')
const { upload } = require('../../utils/upload')
const { authMiddleware } = require('../../middleware/authMiddleware')

const uploadRouter = new Router()

uploadRouter.post(
	"/file",
	authMiddleware,
	upload.single("file"),
  UploadController.uploadFile
)

module.exports = {uploadRouter}