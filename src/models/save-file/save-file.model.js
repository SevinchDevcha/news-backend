const { Schema , model } = require("mongoose")
const { CollectionNames } = require('../../utils/constants')

const documentSchema = new Schema ({
	is_use:{ type:Boolean, default:false },
	file_path : { type:String, required:true },
	where_used : {type:String , enum:["news",""],default:""},
	user:{type:Schema.Types.ObjectId , ref:CollectionNames.USER}
} , {timestamps :{createdAt:"created_at", updatedAt:"updated_at"}, versionKey:false })

const SaveFileModel = model(
	CollectionNames.SAVE_FILE, 
	documentSchema , 
	CollectionNames.SAVE_FILE
)

module.exports = {SaveFileModel}