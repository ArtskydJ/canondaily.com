module.exports = function parseReference(passageReference) {
	var book = passageReference.toLowerCase().replace(/(\w) \d.*/, '$1').replace(/\s+/g, '')
	var reference = passageReference.replace(/.+\w (\d)/g, '$1')

	var startChapter = 1
	var endChapter = Infinity
	var startVerse = 1
	var endVerse = Infinity

	var isOneChapterAndAllVerses = /^\d+$/.test(reference)
	var isMultipleChaptersAndAllVerses = /^\d+\-\d+$/.test(reference)
	var isOneChapterOneVerse = /^\d+:\d+$/.test(reference)
	var isOneChapterMultipleVerses = /^\d+:\d+\-\d+$/.test(reference)
	var isMultipleChaptersMultipleVerses = /^\d+:\d+\-\d+:\d+$/.test(reference)
	
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
	if (startChapter > endChapter) {
		return 'Start Chapter is larger than End Chapter'
	}
	if (startChapter === endChapter && startVerse > endVerse) {
		return 'Start Verse is larger than End Verse'
	}

	return {
		book,
		startChapter,
		startVerse,
		endChapter,
		endVerse
	}
}
