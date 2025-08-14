const { StatusCodes } = require('http-status-codes')
const { newsModel } = require('../../models/news/news.model')
const { SaveFileModel } = require('../../models/save-file/save-file.model')
const { HttpException } = require('../../utils/http-exception')
const { UserModel } = require('../../models/user/user.model')

class NewsController {
	static getAll = async (req, res) => {
		const { search, page, limit } = req.query
		const { user_id } = req.user

		const user = await UserModel.findById(user_id)
		let searchQuery = { _id: { $in: user.news } }

		if (search && search.length > 0) {
			searchQuery = {
				$or: [
					{ title: { $regex: search.trim(), $options: 'i' } },
					{ desc: { $regex: search.trim(), $options: 'i' } },
				],
			}
		}

		const news = await newsModel
			.find(searchQuery)
			.skip((page - 1) * limit)
			.limit(limit)

		const total = await newsModel.countDocuments(searchQuery)

		res.status(200).json({
			success: true,
			data: news,
			pagination: {
				total,
				pages: Number(page),
				limit: Number(limit),
				totalPages: Math.ceil(total / limit),
				hasNextPage: (page - 1) * limit + news.length < total,
				hasPrevPage: page > 1,
			},
		})
	}

	static newsAll = async (req, res) => {
		const news = await newsModel
			.find({})
			.populate('user', 'name email created_at  role') // "name , email" emas, vergul bo‘lmasligi kerak

		const total = await newsModel.countDocuments({})

		res.status(200).json({
			success: true,
			data: news, // Har bir news ichida user.name va user.email bo'ladi
			pagination: { total },
		})
	}

	static add = async (req, res) => {
		const { title, desc, image } = req.body
		const { user_id } = req.user

		const save_file = await SaveFileModel.findOne({ file_path: image })

		if (save_file?.is_use) {
			throw new HttpException(
				StatusCodes.NOT_FOUND,
				'This file has been uploaded before.'
			)
		}

		await SaveFileModel.updateOne(
			{ file_path: image },
			{ is_use: true, where_used: 'news' }
		)

		const news = await newsModel.create({ title, desc, image })
		await UserModel.updateOne({ _id: user_id }, { $push: { news: news._id } })
		await newsModel.updateOne({ _id: news._id }, { user: user_id })
		res.status(200).json({ success: true, msg: 'Card added successfully' })
	}

	static getById = async (req, res) => {
		const { id } = req.params
		const news = await newsModel.findById(id)
		if (!news) {
			throw new HttpException(400, 'Bu document topilmadi !')
		}
		res.status(200).json({ success: true, data: news })
	}

	static delete = async (req, res) => {
		const { id } = req.params
		const { user_id } = req.user

		const user = await UserModel.findById(user_id)
		if (!user) throw new HttpException(404, 'User not found!')

		let news

		if (user.role === 'admin') {
			news = await newsModel.findById(id) // admin hamma newsni o‘chira oladi
		} else {
			news = await newsModel.findOne({ _id: id, user: user_id }) // oddiy user faqat o‘zini
		}

		if (!news) throw new HttpException(400, 'Bu document topilmadi!')

		await news.deleteOne()

		if (news.image) {
			await SaveFileModel.updateOne(
				{ file_path: news.image },
				{ is_use: false, where_used: '', user: null }
			)
		}

		// ✅ News egasining ID sini olib tashlash kerak
		await UserModel.findByIdAndUpdate(news.user, { $pull: { news: id } })

		res.status(200).json({ success: true, msg: 'Card deleted successfully' })
	}

	static update = async (req, res) => {
		const { id } = req.params
		const { title, desc, image } = req.body

		const news = await newsModel.findById(id)
		if (!news) {
			throw new HttpException(400, 'News not found')
		}

		const updateData = {}

		// title yangilash
		if (title && title !== news.title) {
			updateData.title = title
		}

		// desc yangilash
		if (desc && desc !== news.desc) {
			updateData.desc = desc
		}

		// image yangilash
		if (image && image !== news.image) {
			const save_file = await SaveFileModel.findOne({ file_path: image })

			if (!save_file) {
				throw new HttpException(400, 'File not found')
			}

			if (save_file.is_use) {
				throw new HttpException(400, 'The file is already used')
			}

			// Eski rasmni is_use = false qilish
			if (news.image) {
				await SaveFileModel.updateOne(
					{ file_path: news.image },
					{ is_use: false, where_used: '' }
				)
			}

			// Yangi rasmni is_use = true qilish
			await SaveFileModel.updateOne(
				{ file_path: image },
				{ is_use: true, where_used: 'news' }
			)

			updateData.image = image
		}

		await newsModel.findByIdAndUpdate(id, updateData)

		res.status(200).json({ success: true, msg: 'Changes saved successfully' })
	}
}

module.exports = { NewsController }
