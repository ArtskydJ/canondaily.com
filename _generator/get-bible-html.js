var parseReference = require('./parse-reference.js')

module.exports = function getBibleHtml(passageReference) {
	if (!passageReference || passageReference === 'x') {
		throw new Error('Invalid passage reference')
	}

	var ref = parseReference(passageReference)

	var bookObj = require('./world-english-bible-json/' + ref.book + '.json')

	var lastChapterNumber = 0
	var lastVerseNumber = 0
	var textLength = 0
	var bibleText = bookObj.filter(function (chunk) {
		return (
			chunk.chapterNumber >= ref.startChapter &&
			chunk.chapterNumber <= ref.endChapter &&
			( chunk.chapterNumber !== ref.startChapter || chunk.verseNumber >= ref.startVerse ) &&
			( chunk.chapterNumber !== ref.endChapter || chunk.verseNumber <= ref.endVerse ) &&
			( chunk.type === 'paragraph text' || chunk.type === 'line' )
		)
	}).map(function (chunk) {
		var result = ''
		if (lastChapterNumber != chunk.chapterNumber) {
			lastChapterNumber = chunk.chapterNumber
			result += ' <span class="chapter">' + chunk.chapterNumber + '</span>'
		}
		if (lastVerseNumber != chunk.verseNumber) {
			lastVerseNumber = chunk.verseNumber
			result += '<span class="verse">' + chunk.verseNumber + '</span> '
		}
		textLength += chunk.value.length
		return result + chunk.value
	}).join(' ')

	return `<div class="section">
		<span class="reference">${passageReference}</span> ${bibleText}
	</div>`
}
