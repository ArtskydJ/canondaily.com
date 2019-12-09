const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function hashCss() {
	fs.readdirSync(resolve('.'))
		.filter(filename => ( filename.startsWith('style.') && filename.endsWith('.css') ) )
		.forEach(cssFile => { fs.unlinkSync( resolve(cssFile) ) })

	const sourceCssContents = fs.readFileSync( resolve('_generator/style.css'), 'utf-8')

	// https://github.com/sindresorhus/rev-hash/blob/master/index.js
	const revHash = crypto
		.createHash('md5')
		.update(sourceCssContents)
		.digest('hex')
		.slice(0, 10)
	
	fs.writeFileSync(resolve(`style.${revHash}.css`), sourceCssContents, 'utf-8')

	return revHash
}
	
function resolve(relativePathFromRepoRoot) {
	return path.resolve(__dirname, '..', relativePathFromRepoRoot)
}
