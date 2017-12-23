if (process.argv.length < 3) {
	throw new Error('expected command line arguments... node build.js <bookmark> <month>')
}
var bookmark = parseInt(process.argv[2])
var month = parseInt(process.argv[3])

window = {}
require('../_original-bookmarks/transform-bookmarks.js')
require('../dayToPassagesMap.js')
var dtpm = window.dayToPassagesMap
var passagesInMonth = Object.keys(dtpm).filter(function (key) {
	return key.startsWith(month + '/')
}).map(function (dayString) {
	return dtpm[dayString][bookmark - 1]
})

var dayHtmlArr = passagesInMonth.map(function (passage) {
	if (passage.trim() === 'x') {
		console.log('Found empty passage!')
		return '<div><b>EMPTY</b></div>'
	}
	var book = passage.toLowerCase().replace(/(\w) \d.*/, '$1').replace(/\s+/, '')
	var reference = passage.replace(/.+\w (\d)/g, '$1')

	var startChapter = 1
	var endChapter = Infinity
	var startVerse = 1
	var endVerse = Infinity

	if (/^\d+$/.test(reference)) {
		startChapter = endChapter = parseInt(reference)
	} else if (/^\d+\-\d+$/.test(reference)) {
		startChapter = parseInt(reference.split('-')[0])
		endChapter = parseInt(reference.split('-')[1])
	} else if (/^\d+:\d+\-\d+$/.test(reference)) {
		var splitReference = reference.split(':')
		startChapter = endChapter = parseInt(splitReference[0])
		startVerse = parseInt(splitReference[1].split('-')[0])
		endVerse = parseInt(splitReference[1].split('-')[1])
	}

	var bookObj = require('./world-english-bible-json/' + book + '.json')

	var lastChapterNumber = 0
	return '<div><b>' + passage + '</b>' +
	bookObj.filter(function (chunk) {
		return (
			(
				chunk.type === 'paragraph text' ||
				chunk.type === 'line'
			) &&
			chunk.chapterNumber >= startChapter &&
			chunk.chapterNumber <= endChapter &&
			chunk.verseNumber >= startVerse &&
			chunk.verseNumber <= endVerse
		)
	}).map(function (chunk) {
		if (lastChapterNumber != chunk.chapterNumber) {
			lastChapterNumber = chunk.chapterNumber
			return '<br><b>' + book + ' ' + chunk.chapterNumber + '</b>'
		}
		return chunk.value
	}).join(' ') + '</div>'
})

var outputHtml = '<style>div:nth-child(even){background-color:#bbb}b{font-size:1.5em}</style>' +
	passagesInMonth.join('<br>') +
	dayHtmlArr.join('\n')
console.log(dayHtmlArr.length + ' days for month ' + month)

require('fs').writeFileSync('./output.html', outputHtml)
require('opn')('./output.html')
