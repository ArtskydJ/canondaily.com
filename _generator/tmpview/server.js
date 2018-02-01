// if (process.argv.length < 3) {
// 	throw new Error('expected command line arguments... node build.js <bookmark> <month>')
// }
// var bookmark = parseInt(process.argv[2])
// var month = parseInt(process.argv[3])

var http = require('http')
var fs = require('fs')
var parse = require('../_original-bookmarks/parser.js')

var expectedMonthLength = [null,31,28,31,30,31,30,31,31,30,31,30,31]

var server = http.createServer(function (req, res) {
	var bookmarksTxt = fs.readFileSync(__dirname + '/../_original-bookmarks/bookmarks.txt', 'utf-8')
	var dtpm = parse(bookmarksTxt)

	res.write(`<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Bookmarks builder helper</title>
		<style>
			body {
				font-family: calibri, arial, sans-serif;
			}
			body > div:first-child {
				font-size: 12pt;
			}
			body > div {
				font-size: 12pt;
			}
			body > div:nth-child(even) {
				background-color: #bbb;
			}
			b {
				font-size: 1.3em;
			}
		</style>
	</head>
	<body>`)

	for (var bookmark = 1; bookmark <= 4; bookmark++) {
		for (var month = 1; month <= 12; month++) {
			var expectedDays = expectedMonthLength[month]
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
				if (startChapter > endChapter) return res.end('Start Chapter is larger than End Chapter')
				if (startVerse > endVerse) return res.end('Start Verse is larger than End Verse')

				var bookObj = require('./world-english-bible-json/' + book + '.json')

				var lastChapterNumber = 0
				var lastVerseNumber = 0
				var textLength = 0
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
					var result = ''
					if (lastChapterNumber != chunk.chapterNumber) {
						lastChapterNumber = chunk.chapterNumber
						result += ' <b>' + chunk.chapterNumber + '</b> '
					} else if (lastVerseNumber != chunk.verseNumber) {
						lastVerseNumber = chunk.verseNumber
						result += ' <strong>' + chunk.verseNumber + '</strong> '
					}
					textLength += chunk.value.length
					return result + chunk.value
				}).join(' ')

				return `<div>
					<b>${passage}</b> |
					<b style="color:green">${textLength}</b>
					|${bibleText}
				</div>`
			})
			var rightDays = dayHtmlArr.length === expectedDays
			var passageNamesConcat = passagesInMonth.map(function (passage) {
				return passage === 'x' ? '<span style="color:red">EMPTY</span>' : passage
			}).join(' | ')
			var monthHtml = '' //dayHtmlArr.join('\n')

			var outputHtml = `
				<div style="border:3px solid blue;background-color:#eee;">
					${dayHtmlArr.length} days for bookmark ${bookmark}, month ${month}<br>
					<div style="color:red;">${rightDays ? '' : 'Expected ' + expectedDays + ' days'}</div>
					<div style="color:red;">${emptyCount ? emptyCount + ' days are empty' : ''}</div>
					${passageNamesConcat}
				</div>
				${monthHtml}
			`

			res.write(outputHtml)
		}
	}
	res.end('</body></html>')
})

server.listen(80)
