var textIndentationParser = require('./text-indentation-parser.js')


module.exports = function parse(bookStructureTxt) {
	var parsed = textIndentationParser(bookStructureTxt)
	
	
	return parsed.reduce(function (memo, fullLine) {
		var line = fullLine.replace(/^\t+/, '')
		var tabCount = fullLine.length - line.length
		if (line.startsWith('--')) { // comment
			// do nothing
		} else if (tabCount === 0) {
			// not sure
		} else if (tabCount === 1) { // month
			memo.state.dayOfMonth = 1
		} else if (tabCount === 2) { // passage
			var dayString = memo.state.month + '/' + memo.state.dayOfMonth
			if (! memo.result[dayString]) {
				memo.result[dayString] = []
			}
			var passage = line.trim()
			memo.result[dayString].push(passage)
			memo.state.dayOfMonth++
		}
		return memo
	}, {
		state: {
			book: null,
			path: []
		},
		result: {
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
		}
	}).result
}
