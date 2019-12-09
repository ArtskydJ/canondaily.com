const getBookStructureHtml = require('./get-book-structure-html.js')

module.exports = function getBibleHtml(ref) {
	var bookObj = require('world-english-bible/json/' + ref.bookSlug + '.json')

	var intermediateWhatever = bookObj.filter(function (chunk, i, arr) {
		return chunkWithinRef(chunk, ref) || (
			chunk.type.slice(-6) === ' start' &&        // current chunk is a start tag
			arr[i+1] && chunkWithinRef(arr[i+1], ref)   // and next chunk is in the reference
		) || (
			chunk.type.slice(-4) === ' end' &&          // current chunk is an end tag
			arr[i-1] && chunkWithinRef(arr[i-1], ref)   // and previous chunk is in the reference
		)
	})

	var lastChapterNumber = 0
	var lastVerseNumber = 0
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
		<span class="header">${ ref.original }</span>
		<div class="section book-structure dark-bg">${ getBookStructureHtml(ref) }</div>
		${ bibleText }
	</div>`
}

function chunkWithinRef(chunk, ref) {
	return chapterAndVerseWithinRef(chunk.chapterNumber, chunk.verseNumber, ref)
}

function chapterAndVerseWithinRef(chapter, verse, ref) {
	return (
		chapter >= ref.startChapter &&
		chapter <= ref.endChapter &&
		( chapter !== ref.startChapter || verse >= ref.startVerse ) &&
		( chapter !== ref.endChapter || verse <= ref.endVerse )
	)
}
