const { v4 } = require('uuid')
const { UploadS3, deleteS3 } = require('../../utils/S3')
const path = require('path')
const { SaveFileModel } = require('../../models/save-file.js/save-file.model')
const { StatusCodes } = require('http-status-codes')
const { HttpException } = require('../../utils/http-exception')
const { UserModel } = require('../../models/user/user.model')
class UploadController {

	static uploadFile = async (req, res) => {
		const file = req.file
    const {user_id} = req.user

		const user = await UserModel.findById({_id:user_id})
		
		if (!file) {
			throw new HttpException(StatusCodes.NOT_FOUND, 'File not found')
		}

		if (!user) {
			throw new HttpException(StatusCodes.NOT_FOUND, 'User not found')
		}
		
		let file_name = v4() + path.extname(file.originalname)
		if (file?.mimetype.startsWith('image/')) {
			file_name = 'image/' + v4() + path.extname(file.originalname)
		}
		if (file?.mimetype.startsWith('video/')) {
			file_name = 'video/' + v4() + path.extname(file.originalname)
		}

		const file_path = await UploadS3(file_name, file.buffer)

		const filed = await SaveFileModel.create({ file_path })

		await SaveFileModel.updateOne({ _id:filed._id }, { user: user._id } )

		res.status(StatusCodes.CREATED).json({ success: true, file_path })
	}

	static deleteFile = async (req, res)=> {
		try {
			const one_day_ago = new Date(Date.now()-24*60*60*1000) 
			const files = (
				await SaveFileModel.find(
					{ is_use:false,created_at:{$lt :one_day_ago}},
					null,
					{learn:true}
				)
			).map(file=> file.file_path)
			for(const file of files){
				await deleteS3(file)
				await SaveFileModel.deleteOne({file_path:file})
				return files.length.toString()
			}
		} catch {
			throw new HttpException(400 , "Xatolik  bor !!!")
		}
	}
}

module.exports = { UploadController }
