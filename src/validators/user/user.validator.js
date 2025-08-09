const {body , param} = require("express-validator")

class UserValidator {

static signup_admin = ()=> [
  body("name","Fill in the name").notEmpty(),
	body("name","Enter your name !").isString(),
	body("email","Fill in the email !").notEmpty(),
	body("email","Enter your email!").isEmail(),
	body("password","Fill in the password !").notEmpty(),
	body("password","Enter your password !").isLength({min:8})
]

static signup = ()=> [
  body("name","Fill in the name !").notEmpty(),
	body("name","Enter your name !").isString(),
	body("email","Fill in the email !").notEmpty(),
	body("email","Enter your email !").isEmail(),
	body("password","Fill in the password !").notEmpty(),
	body("password","Enter your password !").isLength({min:8})
]

static login = ()=> [
	body("email","Fill in the email !").notEmpty(),
	body("email","Enter your email !").isEmail(),
	body("password","Fill in the password !").notEmpty(),
	body("password","Enter your password !").isLength({min:8})
]

}

module.exports = {UserValidator}