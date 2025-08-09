const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
const {
	AWS_URL,
	AWS_REGION,
	AWS_SECRET_ACCESS_KEY,
	AWS_ACCESS_KEY_ID,
	AWS_BUCKET_NAME,
} = require('./secret')
const { HttpException } = require('./http-exception')

const s3Client = new S3Client({
	region: AWS_REGION,
	endpoint: AWS_URL,
	forcePathStyle: true,
	credentials: {
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
		accessKeyId: AWS_ACCESS_KEY_ID,
	},
})

const UploadS3 = async (key, buffer) => {
	const upload = new Upload({
		client: s3Client,
		params: {
			Bucket: AWS_BUCKET_NAME,
			Key: key,
			Body: buffer,
		},
	})
	try {
		const data = await upload.done()
		if (data?.$metadata?.httpStatusCode === 200) {
			return data.Location
		}
	} catch (error) {
		console.log(error?.msg || 'Xatolik yuz berdi')
	}
}

const deleteS3 = async location => {
	try {
		if (location) {
			const key = location.split('s3.twcstorage.ru/')[1]
			await s3Client.send(
				new DeleteObjectCommand({
					Bucket: AWS_BUCKET_NAME,
					Key: key,
				})
			)
		}
	} catch (error) {
		throw new HttpException(400, 'Xatolik bor S3 Deleteda')
	}
}

module.exports = { UploadS3, deleteS3 }
