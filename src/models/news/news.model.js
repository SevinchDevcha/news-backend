const { Schema, model } = require('mongoose')
const { CollectionNames } = require('../../utils/constants')

const documentSchema = new Schema(
	{
		title: { type: String, required: true },
		desc: { type: String, required: true },
		image: { type: String, required: true },
		user:{type:Schema.Types.ObjectId , ref:CollectionNames.USER}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		versionKey: false,
	}
)

const newsModel = model(
	CollectionNames.NEWS, 
	documentSchema, 
	CollectionNames.NEWS
)

module.exports = { newsModel }
