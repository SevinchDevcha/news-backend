const {body , param} = require("express-validator")

class NewsValidator {

static add = ()=> [
  body("title","titleni to'ldiring !").notEmpty().bail().isString().withMessage("titlega string kiriting !"),
	body("desc","descni to'ldiring !").notEmpty().bail().isString().withMessage("descga string kiriting !"),
	body("image","imageni to'ldiring !").notEmpty()
]

static getById = () => [
	param("id","to'liq emas ID").isMongoId()
]

static update = ()=> [
	param("id","to'liq emas ID").isMongoId(),
	body("title","titlega string kiriting !").optional().isString(),
	body("desc","descga string kiriting !").optional().isString(),
	body("image","image kiriting !").optional().isString(),

]

}

module.exports = {NewsValidator}