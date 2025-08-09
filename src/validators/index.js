const {validationResult} = require("express-validator")

const ExpressValidate = (req , res , next) => {
  const errors =  validationResult(req)

	if(errors.isEmpty()) {
		return next()
	}

	let message = ""

	errors.array().map((err) => {
		message += err.msg + " ,"
	})

	res.status(400).json({success:false , message})

}

module.exports = {ExpressValidate}