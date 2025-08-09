const {Router} = require('express')
const { ExpressValidate } = require('../../validators/index.js')
const { UserValidator } = require('../../validators/user/user.validator.js')
const { UserController } = require('../../controllers/user/user.controller')
const { authMiddleware } = require('../../middleware/authMiddleware.js')
const { RoleMiddleware } = require('../../middleware/role.middleware.js')
const { RoleUser } = require('../../utils/constants.js')

const userRouter = new Router()

userRouter.post(
	"/signup_admin",
	UserValidator.signup_admin(),
	ExpressValidate,
	UserController.signup_admin
)

userRouter.post(
	"/signup",
	UserValidator.signup(),
	ExpressValidate,
	UserController.signup
)

userRouter.post(
	"/login",
  UserValidator.login(),
	ExpressValidate,
	UserController.login
)

userRouter.get(
	"/profile",
  authMiddleware,
	UserController.profile
)

userRouter.get(
	"/userAll",
  authMiddleware,
	RoleMiddleware([RoleUser.ADMIN]),
	UserController.userAll
)

userRouter.delete(
	"/deleteUser/:id",
	authMiddleware,
  UserController.deleteUser

)

module.exports = {userRouter}