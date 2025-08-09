const cron = require("node-cron")
const { UploadController } = require('../controllers/upload/upload.controller')

cron.schedule("59 23 ***" , async ()=> {
	const data = await UploadController.deleteFile()
	console.info(
		`Cron job completed . Deleted files:${data} ! Data : ${new Date().toLocaleString()}`
	)
})