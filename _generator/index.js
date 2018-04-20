var fs = require('fs')
var parse = require('./bookmarks-parser.js')
var getBibleHtml = require('./get-bible-html.js')

var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]

var bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')
var dtpm = parse(bookmarksTxt)

for (var month = 1; month <= 12; month++) {
	for (var day = 1; day <= expectedMonthLength[month]; day++) {
		var passages = dtpm[month + '/' + day]
		// console.log(passages)

		var dayHtml = passages.map(getBibleHtml).join('\n')

		fs.writeFileSync(__dirname + `/../passages/${pad(month)}/${pad(day)}.html`, dayHtml)
	}
}

function pad(num) {
	return ('0' + num).slice(-2)
}