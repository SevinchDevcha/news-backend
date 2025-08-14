const { StatusCodes } = require('http-status-codes')
const { HttpException } = require('../../utils/http-exception.js')
const { REG_KEY, JWT_SECRET } = require('../../utils/secret.js')
const { UserModel } = require('../../models/user/user.model.js')
const { genSalt, compare, hash } = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { RoleUser } = require('../../utils/constants.js')
const { newsModel } = require('../../models/news/news.model.js')
const { SaveFileModel } = require('../../models/save-file/save-file.model.js')

class UserController {
	static signup_admin = async (req, res) => {
		const { reg_key, name, email, password } = req.body
		if (reg_key !== REG_KEY) {
			throw new HttpException(
				StatusCodes.BAD_REQUEST,
				'Enter the correct admin registration key.'
			)
		}

		const email_user = await UserModel.findOne({ email })
		if (email_user) {
			throw new HttpException(
				StatusCodes.BAD_REQUEST,
				'You cannot enter this email.'
			)
		}

		const salt = await genSalt(10)
		const hashPass = await hash(password, salt)

		const newsUser = await UserModel.create({
			name,
			email,
			password: hashPass,
			role: 'admin',
		})

		const token = jwt.sign(
			{ user_id: newsUser._id, role: newsUser.role },
			JWT_SECRET,
			{
				expiresIn: '24h',
			}
		)

		res.status(StatusCodes.CREATED).json({
			success: true,
			role: 'admin',
			msg: 'You have successfully logged in to the admin system.',
			data: token,
		})
	}

	static signup = async (req, res) => {
		const { name, email, password } = req.body

		const email_user = await UserModel.findOne({ email })
		if (email_user) {
			throw new HttpException(
				StatusCodes.BAD_REQUEST,
				'You cannot enter this email.'
			)
		}

		const salt = await genSalt(10)
		const hashPass = await hash(password, salt)

		const newsUser = await UserModel.create({
			name,
			email,
			password: hashPass,
		})

		const token = jwt.sign(
			{ user_id: newsUser._id, role: newsUser.role },
			JWT_SECRET,
			{
				expiresIn: '24h',
			}
		)

		res.status(StatusCodes.CREATED).json({
			success: true,
			msg: 'You have successfully logged in.',
			data: token,
		})
	}

	static login = async (req, res) => {
		const { email, password } = req.body
		const user = await UserModel.findOne({ email })

		if (!user) {
			throw new HttpException(StatusCodes.NOT_FOUND, 'This user was not found.')
		}

		const isMatch = await compare(password, user.password)
		if (!isMatch) {
			throw new HttpException(
				StatusCodes.UNAUTHORIZED,
				'Password is incorrect.'
			)
		}

		const token = jwt.sign({ user_id: user._id, role: user.role }, JWT_SECRET, {
			expiresIn: '24h',
		})

		res.status(StatusCodes.OK).json({
			success: true,
			data: token,
		})
	}

	static profile = async (req, res) => {
		const { user_id, role } = req.user

		const user = await UserModel.findById(user_id).select('-password')
		if (!user) {
			throw new HttpException(400, 'Not user found !')
		}
		res.status(StatusCodes.OK).json({ success: true, data: user, role })
	}

	static userAll = async (req, res) => {
		const news = await UserModel.find({})
		const total = (await UserModel.countDocuments({})) || 0
		res.status(200).json({
			success: true,
			data: news,
			pagination: {
				total,
			},
		})
	}

	static deleteUser = async (req, res) => {
		const { id } = req.params
		const { user_id } = req.user
		const user = await UserModel.findById(id).populate('news')
		if (!user) throw new HttpException(404, 'User not found')
		const admin = await UserModel.findById(user_id)
		if (!admin || admin.role !== RoleUser.ADMIN) {
			throw new HttpException(403, 'Only admin can delete users')
		}
		if (user.news?.length > 0) {
			for (const newsId of user.news) {
				const news = await newsModel.findById(newsId)
				if (news) {
					// Agar rasm bo‘lsa, SaveFileModelni yangilash
					if (news.image) {
						await SaveFileModel.updateOne(
							{ file_path: news.image },
							{ is_use: false, where_used: '', user: null }
						)
					}
					await news.deleteOne()
				}
			}
		}
		await user.deleteOne()

		res.status(StatusCodes.OK).json({
			success: true,
			msg: 'User and all related news deleted ✅',
		})
	}
}

module.exports = { UserController }
