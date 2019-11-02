global.DEBUG = false

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const mustache = require('art-template')

var parseBookmarks = require('./bookmarks-parser.js')
var getBibleHtml = require('./get-bible-html.js')
var proudVsBroken = require('./constant/proud-vs-broken.json')
var meditate = require('./constant/meditate.json')

var bookmarksTxt = fs.readFileSync(__dirname + '/constant/bookmarks.txt', 'utf-8')
var dtpm = parseBookmarks(bookmarksTxt)

const { monthNames, expectedMonthLength, shortMonthNames } = require('./constant/months.json')


const rootDirFiles = fs.readdirSync(path.resolve(__dirname, '..'))
const styleCssFiles = rootDirFiles.filter(filename => (filename.startsWith('style.') && filename.endsWith('.css')))
if (styleCssFiles.length !== 1) {
	throw new Error('Expected 1 style[.hash].css file. Found: ' + (styleCssFiles.join(', ') || 'none'))
}
const oldCssFileName = styleCssFiles[0]
const oldCssFilePath = path.resolve(__dirname, '..', oldCssFileName)
const styleCss = fs.readFileSync(oldCssFilePath, 'utf-8')

// https://github.com/sindresorhus/rev-hash/blob/master/index.js
const revHash = crypto.createHash('md5').update(styleCss).digest('hex').slice(0, 10)

const newCssFileName = 'style.' + revHash + '.css'
const newCssFilePath = path.resolve(__dirname, '..', newCssFileName)
if (oldCssFilePath !== newCssFilePath) {
	fs.renameSync(oldCssFilePath, newCssFilePath)
	console.log('Rename ' + oldCssFileName + ' to ' + newCssFileName)
}

writeSubtemplate('index.html', {
	subtemplate: './calendar.art',
	title: 'Canon Daily',
	revHash,
	range,
	expectedMonthLength,
	monthNames,
	shortMonthNames,
	dayOfWeek: getDayOfWeekOffset(),
})

writeSubtemplate('prayer-for-filling-of-spirit.html', {
	subtemplate: './prayer-for-filling-of-spirit.art',
	title: 'Prayer for the Filling of the Spirit - Canon Daily',
	revHash
})

for (var month = 1; month <= 12; month++) {
	for (var day = 1; day <= expectedMonthLength[month]; day++) {
		writeSubtemplate(monthNames[month] + '/' + day + '.html', {
			subtemplate: './day.art',
			title: monthNames[month] + ' ' + day + ' - Canon Daily',
			revHash,
			month,
			day,
			proudVsBroken: proudVsBroken[day - 1],
			meditate: meditate[day - 1],
			bibleHtml: dtpm[month + '/' + day].map(getBibleHtml).join('\n'),
			monthNames,
			expectedMonthLength,
		})

		if (global.DEBUG && day >= 3) { // debug
			console.log('\nSkipping the daily pages other than Jan 1,2,3')
			console.log('Open localcanondaily.com in your browser.\n')
			process.exit(1)
		}
	}
}

function writeSubtemplate(resultName, data) {
	const templateHtmlPath = path.resolve(__dirname, 'template', 'master.art')
	const resultHtmlPath = path.resolve(__dirname, '..', resultName)
	const resultHtml = mustache(templateHtmlPath, data)
	fs.writeFileSync(resultHtmlPath, resultHtml, 'utf-8')
}

function range(start, end) {
	return Array(end - start + 1).fill().map((_, i) => i + start)
}

function getDayOfWeekOffset() {
	const year = new Date().getUTCFullYear()
	const jan1 = new Date(year, 0)
	jan1.setUTCHours(0)
	return (jan1.getDay() + 1) % 7
}
