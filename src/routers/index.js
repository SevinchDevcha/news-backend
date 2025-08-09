const { newsRouter } = require('./news/news.router')
const { uploadRouter } = require('./upload/upload.router')
const { userRouter } = require('./user/user.router')

const main_router = [
	{path:"/news",router:newsRouter},
	{path:"/upload",router:uploadRouter},
	{path:"/user",router:userRouter}

]

module.exports = {main_router}