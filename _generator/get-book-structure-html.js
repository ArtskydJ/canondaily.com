const bookStructureParser = require('./book-structure-parser.js')

const fs = require('fs')
const path = require('path')
const bookStructureTxt = fs.readFileSync(path.resolve(__dirname, 'constant', 'book-structure.txt'), 'utf-8')
const bookStructure = bookStructureParser( bookStructureTxt )

module.exports = function getBookStructureHtml(ref) {
	return `<ul>
		${ bookStructure[ ref.book ].map( section => {
			const inThisSection = refsOverlap(section.reference, ref)
			var li = formatLi(section, inThisSection)
			if (inThisSection) {
				li += `<ul>
					${ section.children.map( passage => {
						const inThisPassage = refsOverlap(passage.reference, ref)
						return formatLi(passage, inThisPassage)
					}).join('') }
				</ul>`
			}
			return li
		}).join('') }
	</ul>`
		//<li><pre style="font-size:10pt;">${ JSON.stringify( bookStructure[ ref.book ], null, 2) }</pre></li> debug
}

function refsOverlap(ref1, ref2) {
	return (
		ref1.startChapter < ref2.startChapter && ref2.startChapter < ref1.endChapter ||
		ref1.startChapter < ref2.endChapter && ref2.endChapter < ref1.endChapter ||
		ref2.startChapter < ref1.startChapter && ref1.startChapter < ref2.endChapter ||
		ref2.startChapter < ref1.endChapter && ref1.endChapter < ref2.endChapter ||
		(
			(
				ref1.startChapter === ref2.startChapter ||
				ref1.endChapter === ref2.endChapter
			) && (
				ref1.startVerse <= ref2.startVerse && ref2.startVerse <= ref1.endVerse ||
				ref1.startVerse <= ref2.endVerse && ref2.endVerse <= ref1.endVerse ||
				ref2.startVerse <= ref1.startVerse && ref1.startVerse <= ref2.endVerse ||
				ref2.startVerse <= ref1.endVerse && ref1.endVerse <= ref2.endVerse
			)
		)
	)
}

function formatLi(sectionOrPassage, bold) {
	const ref = sectionOrPassage.reference
	const shortRefStr = ref.original.slice(ref.book.length + 1)
	var line = sectionOrPassage.text + ' (' + shortRefStr + ')'
	if (bold) line = '<b>' + line + '</b>'
	return '<li>' + line + '</li>'
}

/*
	no idea if this works:
	
		chapterAndVerseWithinRef(ref1.startChapter, ref1.startVerse, ref2) ||
		chapterAndVerseWithinRef(ref1.endChapter, ref1.endVerse, ref2) ||
		chapterAndVerseWithinRef(ref2.startChapter, ref2.startVerse, ref1) ||
		chapterAndVerseWithinRef(ref2.endChapter, ref2.endVerse, ref1)

function chapterAndVerseWithinRef(chapter, verse, ref) {
	return (
		chapter >= ref.startChapter &&
		chapter <= ref.endChapter &&
		( chapter !== ref.startChapter || verse >= ref.startVerse ) &&
		( chapter !== ref.endChapter || verse <= ref.endVerse )
	)
}
*/
