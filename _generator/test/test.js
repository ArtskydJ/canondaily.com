var fs = require('fs')
var parse = require('../bookmarks-parser.js')
var parseReference = require('../parse-reference.js')

var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]

var bookmarksTxt = fs.readFileSync(__dirname + '/../bookmarks.txt', 'utf-8')
var dtpm = parse(bookmarksTxt)

var currRef = { book: null }
var prevRef = { book: null }
var lineNumber = 0
for (var part = 0; part < 4; part++) {
	lineNumber++
	for (var month = 1; month <= 12; month++) {
		lineNumber++
		for (var day = 1; day <= expectedMonthLength[month]; day++) {
			lineNumber++
			prevRef = currRef
			var currentPassages = dtpm[month + '/' + day]
			currRef = parseReference(currentPassages[part])

			var expectNextVerse = `${prevRef.book} ${prevRef.startChapter}:${prevRef.endVerse + 1}`
			var expectNextChapter = `${prevRef.book} ${prevRef.startChapter + 1}:1`

			if (prevRef.book === currRef.book) {
				if ( currRef.startChapter === prevRef.endChapter + 1 && currRef.startVerse !== 1 ) {
					outputError(`${expectNextChapter}`)
				}
				if ( currRef.startChapter === prevRef.endChapter && currRef.startVerse !== prevRef.endVerse + 1 ) {
					outputError(`${expectNextVerse}`)
				}
				if ( currRef.startChapter !== prevRef.endChapter && currRef.startChapter !== prevRef.endChapter + 1 ) {
					outputError(`${expectNextVerse} OR ${expectNextChapter}`)
				}
			} else if ( currRef.startChapter !== 1 || currRef.startVerse !== 1 ) {
				outputError(`[Book after ${prevRef.book}] 1:1`)
			}
		}
	}
}

function outputError(expectedStr) {
	process.exitCode = 1
	console.error(`Line ${lineNumber}
		Expected: ${expectedStr}
		Actual: ${currentPassages[part]}
	`)
}
