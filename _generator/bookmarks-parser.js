const months = {
	January: 1,
	February: 2,
	March: 3,
	April: 4,
	May: 5,
	June: 6,
	July: 7,
	August: 8,
	September: 9,
	October: 10,
	November: 11,
	December: 12
}

module.exports = function parse(bookmarksTxt) {
	return bookmarksTxt.split('\n').reduce(function (memo, line) {
		if (line.startsWith('\t\t\t--')) { // comment
		} else if (line.startsWith('\t\t')) { // passage
			var dayString = memo.state.month + '/' + memo.state.dayOfMonth
			if (! memo.result[dayString]) {
				memo.result[dayString] = []
			}
			var passage = line.trim()
			memo.result[dayString].push(passage)
			memo.state.dayOfMonth++
		} else if (line.startsWith('\t')) { // month
			memo.state.dayOfMonth = 1
			memo.state.month = months[ line.trim() ]
		}
		return memo
	}, {
		state: {
			month: null,
			dayOfMonth: 1
		},
		result: {
			// "1/1": [ "Genesis 1-2", "Psalm 1", "Matthew 1:1-17", "Acts 1:1-11" ],
			// "1/2":["Genesis 3-4","Psalm 2","Matthew 1:18-25","Acts 1:12-26"],
			// ...
		}
	}).result
}
