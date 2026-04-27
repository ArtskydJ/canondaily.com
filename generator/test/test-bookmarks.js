var fs = require('fs')
var parse = require('../bookmarks-parser.js')
var parseReference = require('../parse-reference.js')
var expectedMonthLength = require('../constant/months.json').expectedMonthLength

var bookmarksTxt = fs.readFileSync(__dirname + '/../constant/bookmarks.txt', 'utf-8')
var dtpm = parse(bookmarksTxt)

var lastVerseCache = {}

var currRef = { book: null }
var prevRef = { book: null }
var currentPassages
var lineNumber = 0
for (var part = 0; part < 4; part++) {
	lineNumber++
	for (var month = 1; month <= 12; month++) {
		lineNumber++
		for (var day = 1; day <= expectedMonthLength[month]; day++) {
			lineNumber++
			prevRef = currRef
			currentPassages = dtpm[part][month][day]
			currRef = parseReference(currentPassages)
			checkContinuity(prevRef, currRef)
		}
	}
}
if (!process.exitCode) {
	console.log('ok')
}

function checkContinuity(prev, curr) {
	// A new chapter or book may begin either with no verse spec (whole chapter) or starting at verse 1.
	var newChapterStart = curr.startVerse === undefined || curr.startVerse === 1

	if (prev.book !== curr.book) {
		if (curr.startChapter !== 1 || !newChapterStart) {
			outputError('[Book after ' + prev.book + '] 1 (or 1:1-N)')
		}
		checkChapterFullyRead(prev)
		return
	}

	if (curr.startChapter === prev.endChapter) {
		if (prev.endVerse === undefined || curr.startVerse !== prev.endVerse + 1) {
			var nextV = prev.endVerse !== undefined ? prev.endVerse + 1 : '?'
			outputError(prev.book + ' ' + prev.endChapter + ':' + nextV + '-N')
		}
		return
	}

	if (curr.startChapter === prev.endChapter + 1) {
		if (!newChapterStart) {
			var nextCh = prev.endChapter + 1
			outputError(prev.book + ' ' + nextCh + ' (or ' + nextCh + ':1-N)')
		}
		checkChapterFullyRead(prev)
		return
	}

	var fromVerse = prev.endVerse !== undefined
		? prev.book + ' ' + prev.endChapter + ':' + (prev.endVerse + 1) + '-N OR '
		: ''
	outputError(fromVerse + prev.book + ' ' + (prev.endChapter + 1))
}

// If prev ended mid-chapter, the next reading shouldn't have advanced past that chapter
// without finishing it first. Whole-chapter reads (endVerse === undefined) are exempt.
function checkChapterFullyRead(prev) {
	if (prev.endVerse === undefined || !prev.bookSlug) return
	var lastV = lastVerseOfChapter(prev.bookSlug, prev.endChapter)
	if (lastV === undefined || prev.endVerse >= lastV) return
	var missingFrom = prev.endVerse + 1
	var missing = missingFrom === lastV
		? prev.book + ' ' + prev.endChapter + ':' + missingFrom
		: prev.book + ' ' + prev.endChapter + ':' + missingFrom + '-' + lastV
	outputError(missing + ' (rest of ch.' + prev.endChapter + ' was skipped)')
}

function lastVerseOfChapter(bookSlug, chapter) {
	if (!lastVerseCache[bookSlug]) {
		var book = require('world-english-bible/json/' + bookSlug + '.json')
		var maxByChapter = {}
		for (var i = 0; i < book.length; i++) {
			var chunk = book[i]
			if (chunk.chapterNumber === undefined || chunk.verseNumber === undefined) continue
			if (!maxByChapter[chunk.chapterNumber] || chunk.verseNumber > maxByChapter[chunk.chapterNumber]) {
				maxByChapter[chunk.chapterNumber] = chunk.verseNumber
			}
		}
		lastVerseCache[bookSlug] = maxByChapter
	}
	return lastVerseCache[bookSlug][chapter]
}

function outputError(expectedStr) {
	process.exitCode = 1
	console.error('bookmarks.txt Line ' + lineNumber + '\n  Expected: ' + expectedStr + '\n  Actual: ' + currentPassages)
}
