module.exports = function parseReference(passageRefStr) {
	if (! passageRefStr || passageRefStr === 'x') {
		throw new Error('Invalid passage reference: "' + passageRefStr + '"')
	}
	const book = passageRefStr.replace(/ \d.*/, '').trim()
	const bookSlug = book.toLowerCase().replace(/ \d.*/, '').replace(/\s+/g, '')
	let reference = passageRefStr.replace(/.+\w (\d)/g, '$1')

	let startChapter, endChapter, startVerse, endVerse

	let isOneChapterAndAllVerses = /^\d+$/.test(reference)
	let isMultipleChaptersAndAllVerses = /^\d+-\d+$/.test(reference)
	let isOneChapterAndOneVerse = /^\d+:\d+$/.test(reference)
	let isOneChapterAndMultipleVerses = /^\d+:\d+-\d+$/.test(reference)
	let isMultipleChaptersAndMultipleVerses = /^\d+:\d+-\d+:\d+$/.test(reference)
	
	if (isOneChapterAndAllVerses) {
		startChapter = endChapter = parseInt(reference)
		startVerse = 1
	} else if (isMultipleChaptersAndAllVerses) {
		startChapter = parseInt(reference.split('-')[0])
		endChapter = parseInt(reference.split('-')[1])
		startVerse = 1
	} else if (isOneChapterAndOneVerse) {
		let splitReference = reference.split(':')
		startChapter = endChapter = parseInt(splitReference[0])
		startVerse = endVerse = parseInt(splitReference[1])
	} else if (isOneChapterAndMultipleVerses) {
		let splitReference = reference.split(':')
		startChapter = endChapter = parseInt(splitReference[0])
		startVerse = parseInt(splitReference[1].split('-')[0])
		endVerse = parseInt(splitReference[1].split('-')[1])
	} else if (isMultipleChaptersAndMultipleVerses) {
		let splitReference = reference.split('-')
		let splitReference0 = splitReference[0].split(':')
		let splitReference1 = splitReference[1].split(':')
		startChapter = parseInt(splitReference0[0])
		endChapter = parseInt(splitReference1[0])
		startVerse = parseInt(splitReference0[1])
		endVerse = parseInt(splitReference1[1])
	}
	if (startChapter > endChapter) {
		throw new Error('Start Chapter is larger than End Chapter')
	}
	if (startChapter === endChapter && startVerse > endVerse) {
		throw new Error('Start Verse is larger than End Verse')
	}

	return {
		original: passageRefStr,
		book,
		bookSlug,
		startChapter,
		startVerse,
		endChapter,
		endVerse
	}
}
