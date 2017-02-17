const fs = require('fs')

const bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')

var result = bookmarksTxt.split('\n').reduce(function (memo, line) {
	if (line.startsWith('\t\t\t')) { // passage
		var dayString = memo.state.month + '/' + memo.state.dayOfMonth
		if (!memo.result[dayString]) {
			memo.result[dayString] = []
		}
		var passage = memo.state.book + ' ' + line.trim()
		memo.result[dayString].push(passage)
		memo.state.dayOfMonth++
	} else if (line.startsWith('\t\t')) { // book
		memo.state.book = line.trim()
	} else if (line.startsWith('\t')) { // month
		memo.state.dayOfMonth = 1
		memo.state.month = line.trim()
	}
	return memo
}, {
	state: {
		month: null,
		book: null,
		dayOfMonth: 1
	},
	result: {
		// 'January 1': [ 'Genesis 1-2', 'Psalms 1', 'Matthew 1:1-17', 'Acts 1:1-11' ]
	}
}).result

// console.log(result)
const indexHtml = fs.readFileSync(__dirname + '/../index.html', 'utf-8')
const newIndexHtml = indexHtml.replace(
	/\/\* auto-generated start \*\/.+\/\* auto-generated end \*\//,
	'/* auto-generated start */' + JSON.stringify(result) + '/* auto-generated end */'
)
fs.writeFileSync(__dirname + '/../index.html', newIndexHtml)
