var textIndentationParser = require('./text-indentation-parser.js')
var parseReference = require('./parse-reference.js')


module.exports = function parse(bookStructureTxt) {
	var parsed = textIndentationParser(bookStructureTxt)
	
	
	return parsed.reduce(function (memo, book) {
		var bookName = book.text.trim()
		memo[ bookName ] = book.children.map(function (category) {
			return {
				text: category.text,
				book: bookName,
				children: category.children.map(function (passage) {
					var possibleReference = passage.text.split(' ', 1)[0]
					var fullPossibleReference = bookName + ' ' + possibleReference
					var ref = parseReference(fullPossibleReference)
					if (! isValidReference(ref)) {
						throw new Error(`Invalid reference: ${ category.text } ${ passage.text }`)
					}
					
					return {
						book: bookName,
						reference: ref,
						text: passage.text.slice(possibleReference.length + 1)
					}
				})
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



const fs = require('fs')
var bookStructureTxt = fs.readFileSync(__dirname + '/constant/book-structure.txt', 'utf-8')
console.log(JSON.stringify(module.exports(bookStructureTxt), null, 2))
