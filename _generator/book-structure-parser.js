var textIndentationParser = require('./text-indentation-parser.js')
var parseReference = require('./parse-reference.js')


module.exports = function parse(bookStructureTxt) {
	var parsed = textIndentationParser(bookStructureTxt)
	
	
	return parsed.reduce(function (memo, book) {
		var bookName = book.text.trim()
		memo[ bookName ] = book.children.map(function (category) {
			var children = category.children.map(function (passage) {
				var possibleReference = passage.text.split(' ', 1)[0]
				var fullPossibleReference = bookName + ' ' + possibleReference
				var ref = parseReference(fullPossibleReference)
				if (! isValidReference(ref)) {
					throw new Error(`Invalid reference: ${ category.text } ${ passage.text }`)
				}
				
				return {
					book: bookName,
					reference: ref,
					text: passage.text.slice(possibleReference.length).trim()
				}
			})
			
			var ref1 = children[0].reference
			var ref2 = children[ children.length - 1].reference
			if (! ref1) {
				console.log(category)
				console.log('CATEGORY HAS NO CHILDREN')
				process.exit()
			}
			let reference = {
				original:
					ref1.book + ' ' +
					ref1.startChapter + ( ref1.startVerse !== undefined ? ':' + ref1.startVerse : '' ) + '-' +
					ref2.endChapter + (ref2.endVerse !== undefined ? ':' + ref2.endVerse : '' ),
				book: ref1.book,
				bookSlug: ref1.bookSlug,
				startChapter: ref1.startChapter,
				startVerse: ref1.startVerse,
				endChapter: ref2.endChapter,
				endVerse: ref2.endVerse,
			}
			
			return {
				text: category.text,
				book: bookName,
				children,
				reference,
			}
		})
		return memo
	}, {
		// Revelation: [
		//     {
		//         text: 'Introduction', 
		//         type: 'branch',
		//         children: [
		//             { type: 'leaf', passage: 'Revelation 1:1-11',  text: 'How to read the book and submit to it' }
		//         ]
		//     },
		//     {
		//         text: 'First Septet - The seven churches - The church militant', 
		//         type: 'branch',
		//         children: [
		//             { type: 'leaf', passage: 'Revelation 1:12-20', text: 'Introduction to the seven churches - Christ is present with his church' },
		//             { type: 'leaf', passage: 'Revelation 2:1-7',   text: 'Ephesus' },
		//             { type: 'leaf', passage: 'Revelation 2:8-11',  text: 'Smyrna' },
		//             ...
		//         ]
		//     },
		//     ...
		// ]
	})
	
	
	function isValidReference(ref) {
		return ref.endChapter !== Infinity
	}
}



// const fs = require('fs')
// var bookStructureTxt = fs.readFileSync(__dirname + '/constant/book-structure.txt', 'utf-8')
// console.log(JSON.stringify(module.exports(bookStructureTxt), null, 2))
