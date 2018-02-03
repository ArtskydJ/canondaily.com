var parseReference = require('./parse-reference.js')

module.exports = function getBibleHtml(passageReference) {
	if (!passageReference || passageReference === 'x') {
		throw new Error('Invalid passage reference')
	}

	var ref = parseReference(passageReference)

	var bookObj = require('world-english-bible/json/' + ref.book + '.json')

	var lastChapterNumber = 0
	var lastVerseNumber = 0
	var textLength = 0
	var intermediateWhatever = bookObj.filter(function (chunk, i, arr) {
		return (
			(
				arr[i+1] &&
				chunkWithinRange(ref, arr[i+1]) && (
					chunk.type === 'stanza start' ||
					chunk.type === 'paragraph start'
				) 
			) || (
				arr[i-1] &&
				chunkWithinRange(ref, arr[i-1]) && (
					chunk.type === 'stanza end' ||
					chunk.type === 'paragraph end'
				)
			) || (
				chunkWithinRange(ref, chunk) /*&& (
					chunk.type === 'line' ||
					chunk.type === 'break' ||
					chunk.type === 'paragraph text'
				)*/
			)
		)
	})//.reduce(function (memo, chunk, i, arr) {
	//	if (memo.length) {
	//		memo.push(chunk)
	//	} else if (chunk.type === 'paragraph start' && arr[i+1] && arr[i+1].type === 'paragraph end') {
	//	} else if (chunk.type === 'stanza start' && arr[i+1] && arr[i+1].type === 'stanza end') {
	//	} else {
	//		memo.push(chunk)
	//	}
	//	return memo
	//}, [])

	// require('fs').writeFileSync('./temp.json', JSON.stringify(intermediateWhatever, null, ' '), 'utf-8')

	var bibleText  = intermediateWhatever.map(function (chunk) {
		var result = ''
		if (chunk.type === 'paragraph start') {
			result += '<span class="paragraph">'
		} else if (chunk.type === 'paragraph end') {
			result += '</span>'
		} else if (chunk.type === 'stanza start') {
			result += '<span class="stanza">'
		} else if (chunk.type === 'stanza end') {
			result += '</span>'
		} else if (chunk.type === 'break') {
			result += '<br>'
		} else if (chunk.type === 'paragraph text' || chunk.type === 'line')  {
			if (lastChapterNumber != chunk.chapterNumber) {
				lastChapterNumber = chunk.chapterNumber
				result += ' <span class="chapter">' + chunk.chapterNumber + '</span>'
			}
			if (lastVerseNumber != chunk.verseNumber) {
				lastVerseNumber = chunk.verseNumber
				result += '<span class="verse">' + chunk.verseNumber + '</span> '
			}
			result = '<span class="' + chunk.type.replace(/ /g, '') + '">' + result + chunk.value + '</span>'
		}
		return result
	}).join(' ')

	return `<div class="section">
		<span class="reference">${passageReference}</span> ${bibleText}
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


// All formatting is lost. getBibleHtml() should read and pass along these types
// - paragraph start
// - paragraph end
// - stanza start
// - stanza end
// - paragraph text
// - line
// - break
