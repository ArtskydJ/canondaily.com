const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function hashFile(prefix, suffix) {
	fs.readdirSync(resolve('.'))
		.filter(filename => filename.startsWith(`${prefix}.`) && filename.endsWith(`.${suffix}`) )
		.forEach(filename => fs.unlinkSync( resolve(filename) ) )

	const sourceFileContents = fs.readFileSync( resolve(`_generator/${prefix}.${suffix}`), 'utf-8')

	// https://github.com/sindresorhus/rev-hash/blob/master/index.js
	const revHash = crypto
		.createHash('md5')
		.update(sourceFileContents)
		.digest('hex')
		.slice(0, 10)

	fs.writeFileSync(resolve(`${prefix}.${revHash}.${suffix}`), sourceFileContents, 'utf-8')

	return revHash
}

function resolve(relativePathFromRepoRoot) {
	return path.resolve(__dirname, '..', relativePathFromRepoRoot)
}
