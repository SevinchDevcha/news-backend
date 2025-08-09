const { StatusCodes } = require('http-status-codes')
const { HttpException } = require('../utils/http-exception')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../utils/secret')
const { asyncHandler } = require('../utils/asyncHandler')

const authMiddleware = asyncHandler((req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1]
	if (!token) {
		throw new HttpException(StatusCodes.NOT_FOUND, 'token not found')
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		req.user = { user_id: decoded.user_id  , role:decoded.role}
		next()
	} catch (err) {
		throw new HttpException(StatusCodes.UNAUTHORIZED, 'Token is invalid or expired')
	}
})

module.exports = { authMiddleware }
