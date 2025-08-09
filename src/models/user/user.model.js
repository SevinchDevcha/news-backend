const { Schema, model } = require('mongoose')
const { CollectionNames, RoleUser } = require('../../utils/constants')

const documentSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type:String, required: true },
		password: { type: String, required: true },
		role: {
			type:String,
			enum: [RoleUser.ADMIN, RoleUser.USER],
			default: RoleUser.USER,
		},
		news: [{ type: Schema.Types.ObjectId, ref: CollectionNames.NEWS }],
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
		versionKey: false,
	}
)

const UserModel = model(
	CollectionNames.USER,
	documentSchema,
	CollectionNames.USER
)

module.exports = { UserModel }
