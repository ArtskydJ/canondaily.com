var parseReference = require('./parse-reference.js')

module.exports = function getBibleHtml(passageReference) {
	if (!passageReference || passageReference === 'x') {
		throw new Error('Invalid passage reference')
	}

	var ref = parseReference(passageReference)

	var bookObj = require('world-english-bible/json/' + ref.book + '.json')

	var intermediateWhatever = bookObj.filter(function (chunk, i, arr) {
		return chunkWithinRange(ref, chunk) || (
			chunk.type.slice(-6) === ' start' &&        // current chunk is a start tag
			arr[i+1] && chunkWithinRange(ref, arr[i+1]) // and next chunk is in range
		) || (
			chunk.type.slice(-4) === ' end' &&          // current chunk is an end tag
			arr[i-1] && chunkWithinRange(ref, arr[i-1]) // and previous chunk is in range
		)
	})

	var lastChapterNumber = 0
	var lastVerseNumber = 0
	var textLength = 0
	var bibleText  = intermediateWhatever.map(function (chunk) {
		if (chunk.type === 'paragraph start') return '<span class="paragraph">'
		if (chunk.type === 'paragraph end')   return '</span>'
		if (chunk.type === 'stanza start')    return '<span class="stanza">'
		if (chunk.type === 'stanza end')      return '</span>'
		if (chunk.type === 'break')           return '<br>'
		if (chunk.type === 'paragraph text' || chunk.type === 'line') {
			var result = ''
			if (lastChapterNumber != chunk.chapterNumber) {
				lastChapterNumber = chunk.chapterNumber
				result += ' <span class="chapter">' + chunk.chapterNumber + '</span>'
			}
			if (lastVerseNumber != chunk.verseNumber) {
				lastVerseNumber = chunk.verseNumber
				result += '<span class="verse">' + chunk.verseNumber + '</span> '
			}
			return '<span class="' + chunk.type.replace(/ /g, '') + '">' + result + chunk.value + '</span>'
		}
	}).join(' ')

	return `<div class="section">
		<span class="header">${passageReference}</span> ${bibleText}
	</div>`
}

function chunkWithinRange(ref, chunk) {
	return (
		chunk.chapterNumber >= ref.startChapter &&
		chunk.chapterNumber <= ref.endChapter &&
		( chunk.chapterNumber !== ref.startChapter || chunk.verseNumber >= ref.startVerse ) &&
		( chunk.chapterNumber !== ref.endChapter || chunk.verseNumber <= ref.endVerse )
	)
}
