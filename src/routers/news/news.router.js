const {Router} = require('express')
const { NewsController } = require('../../controllers/news/news.controller')
const { NewsValidator } = require('../../validators/news/news.validator')
const { ExpressValidate } = require('../../validators')
const { authMiddleware } = require('../../middleware/authMiddleware')
const { RoleMiddleware } = require('../../middleware/role.middleware')
const { RoleUser } = require('../../utils/constants')

const newsRouter = new Router()

newsRouter.get(
	"/get-all",
	authMiddleware,
	NewsController.getAll
)

newsRouter.get(
	"/newsAll",
	authMiddleware,
	RoleMiddleware([RoleUser.ADMIN]),
	NewsController.newsAll
)

newsRouter.post(
	"/add",
	authMiddleware,
	NewsValidator.add(),
	ExpressValidate,
	NewsController.add)

newsRouter.get(
	"/getById/:id",
	authMiddleware,
	NewsValidator.getById(),
	ExpressValidate,
	NewsController.getById)

newsRouter.delete(
	"/delete/:id",
	authMiddleware,
	NewsValidator.getById(),
	ExpressValidate,
	NewsController.delete)

newsRouter.put(
	"/update/:id",
	authMiddleware,
	NewsValidator.update(),
	ExpressValidate,
	NewsController.update)

module.exports = {newsRouter}