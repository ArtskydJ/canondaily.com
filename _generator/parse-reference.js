module.exports = function parseReference(passageReference) {
	var book = passageReference.toLowerCase().replace(/(\w) \d.*/, '$1').replace(/\s+/g, '')
	var reference = passageReference.replace(/.+\w (\d)/g, '$1')

	var startChapter = 1
	var endChapter = Infinity
	var startVerse = 1
	var endVerse = Infinity

	var isOneChapterAndAllVerses = /^\d+$/.test(reference)
	var isMultipleChaptersAndAllVerses = /^\d+\-\d+$/.test(reference)
	var isOneChapterAndOneVerse = /^\d+:\d+$/.test(reference)
	var isOneChapterAndMultipleVerses = /^\d+:\d+\-\d+$/.test(reference)
	var isMultipleChaptersAndMultipleVerses = /^\d+:\d+\-\d+:\d+$/.test(reference)
	
	if (isOneChapterAndAllVerses) {
		startChapter = endChapter = parseInt(reference)
	} else if (isMultipleChaptersAndAllVerses) {
		startChapter = parseInt(reference.split('-')[0])
		endChapter = parseInt(reference.split('-')[1])
	} else if (isOneChapterAndOneVerse) {
		var splitReference = reference.split(':')
		startChapter = endChapter = parseInt(splitReference[0])
		startVerse = endVerse = parseInt(splitReference[1])
	} else if (isOneChapterAndMultipleVerses) {
		var splitReference = reference.split(':')
		startChapter = endChapter = parseInt(splitReference[0])
		startVerse = parseInt(splitReference[1].split('-')[0])
		endVerse = parseInt(splitReference[1].split('-')[1])
	} else if (isMultipleChaptersAndMultipleVerses) {
		var splitReference = reference.split('-')
		var splitReference0 = splitReference[0].split(':')
		var splitReference1 = splitReference[1].split(':')
		startChapter = parseInt(splitReference0[0])
		endChapter = parseInt(splitReference1[0])
		startVerse = parseInt(splitReference0[1])
		endVerse = parseInt(splitReference1[1])
	}
	/*
	if (startChapter > endChapter) {
		throw new Error('Start Chapter is larger than End Chapter')
	}
	if (startChapter === endChapter && startVerse > endVerse) {
		throw new Error('Start Verse is larger than End Verse')
	}
	*/

	return {
		book,
		startChapter,
		startVerse,
		endChapter,
		endVerse
	}
}
