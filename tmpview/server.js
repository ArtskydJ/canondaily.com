// if (process.argv.length < 3) {
// 	throw new Error('expected command line arguments... node build.js <bookmark> <month>')
// }
// var bookmark = parseInt(process.argv[2])
// var month = parseInt(process.argv[3])

var http = require('http')
var fs = require('fs')
var parseUrl = require('url').parse
var parse = require('../_original-bookmarks/parser.js')

var expectedMonthLength = [null,31,28,31,30,31,30,31,31,30,31,30,31]

var server = http.createServer(function (req, res) {
	var urlObj = parseUrl(req.url, true)
	var bookmark = urlObj.query.bookmark
	var month = urlObj.query.month
	if (!bookmark || !month) {
		res.writeHead(500)
		res.end('expected a month and bookmark in the query string')
	}
	var expectedDays = expectedMonthLength[month]

	var bookmarksTxt = fs.readFileSync(__dirname + '/../_original-bookmarks/bookmarks.txt', 'utf-8')
	var dtpm = parse(bookmarksTxt)

	var emptyCount = 0
	var passagesInMonth = Object.keys(dtpm).filter(function (key) {
		return key.startsWith(month + '/')
	}).map(function (dayString) {
		var passage = (dtpm[dayString][bookmark - 1] || 'x').trim()
		if (passage === 'x') {
			emptyCount++
		}
		return passage
	})

	var dayHtmlArr = passagesInMonth.map(function (passage) {
		if (passage === 'x') {
			return '<div><b style="color:red">EMPTY</b></div>'
		}
		var book = passage.toLowerCase().replace(/(\w) \d.*/, '$1').replace(/\s+/g, '')
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
		var bibleText = bookObj.filter(function (chunk) {
			return (
				chunk.chapterNumber >= startChapter &&
				chunk.chapterNumber <= endChapter &&
				chunk.verseNumber >= startVerse &&
				chunk.verseNumber <= endVerse && (
					chunk.type === 'paragraph text' ||
					chunk.type === 'line'
				)
			)
		}).map(function (chunk) {
			if (lastChapterNumber != chunk.chapterNumber) {
				lastChapterNumber = chunk.chapterNumber
				return ' <b>' + chunk.chapterNumber + '</b> ' + chunk.value
			}
			return chunk.value
		}).join(' ')

		return `<div><b>${passage}</b> |${bibleText}</div>`
	})
	var rightDays = dayHtmlArr.length === expectedDays

	var outputHtml = `
	<style>
		body {
			font-family: calibri, arial, sans-serif;
		}
		body > div:first-child {
			font-size: 10pt;
		}
		body > div {
			font-size: 8pt;
		}
		body > div:nth-child(even) {
			background-color: #bbb;
		}
		b {
			font-size: 1.3em;
		}
	</style>
	<body>
		<div style="border:3px solid blue">
			${dayHtmlArr.length} days for month ${month}<br>
			<div style="color:red;">${rightDays ? '' : 'Expected ' + expectedDays + ' days'}</div>
			<div style="color:red;">${emptyCount ? emptyCount + ' days are empty' : ''}</div>
			${passagesInMonth.map(function (passage) {
				return passage === 'x' ? '<span style="color:red">EMPTY</span>' : passage
			}).join('<br>')}
		</div>
		${dayHtmlArr.join('\n')}
	</body>`

	res.end(outputHtml)
})

server.listen(80)
