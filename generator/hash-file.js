const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function hashFile(sourceFilePath) {
	const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf-8')

	const revHash = md5(sourceFileContents).slice(0, 10)

	const sourceFileName = path.basename(sourceFilePath)
	const destFileName = insertRevHash(sourceFileName, revHash)

	return { sourceFileContents, destFileName }
}

function md5(sourceFileContents) {
	return crypto
		.createHash('md5')
		.update(sourceFileContents)
		.digest('hex')
}

function insertRevHash(fileName, revHash) {
	const extIndex = fileName.lastIndexOf('.')
	return fileName.slice(0, extIndex + 1) + revHash + fileName.slice(extIndex)
}
