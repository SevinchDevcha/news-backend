const { UserModel } = require('../models/user/user.model')
const { HttpException } = require('../utils/http-exception')

const RoleMiddleware = roles => {
	return async (req, res, next) => {
		const { role} = req.user
		if (!req.user) {
      throw new HttpException(401, "Unauthorized");
    }
		if (!roles.includes(role)) {
			throw new HttpException(400, 'User role not found')
		}
		next()
	}
}
module.exports = { RoleMiddleware }
