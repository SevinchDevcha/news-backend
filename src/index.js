const express = require('express')
const app = express()
const { main_router } = require('./routers')
const {PORT} = require('./utils/secret.js')
const { ConnectDB } = require('./utils/config.database.js')
const { errorMiddleware } = require('./middleware/error.middleware.js')
const cors = require('cors')

void ConnectDB()

app.use(express.json())
app.use(express.text())


app.use(cors({
  origin: ["*" , "https://devcha.uz"],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));


app.get("/",(req , res) => {
	res.status(201).json({success:true , msg:"Nma gap"})
})

main_router.forEach((value) => {
	app.use(value.path , value.router)
})

app.use(errorMiddleware)

app.listen(PORT , ()=> {
	console.log(`Explore ports http://localhost:${PORT}`);
})
