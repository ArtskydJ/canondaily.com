
var fs = require('fs')
var parse = require('../_original-bookmarks/parser.js')
var getBibleHtml = require('./get-bible-html.js')

var expectedMonthLength = [null,31,28,31,30,31,30,31,31,30,31,30,31]

var bookmarksTxt = fs.readFileSync(__dirname + '/../_original-bookmarks/bookmarks.txt', 'utf-8')
var dtpm = parse(bookmarksTxt)

for (var bookmark = 1; bookmark <= 4; bookmark++) {
	for (var month = 1; month <= 12; month++) {
		var expectedDays = expectedMonthLength[month]
		var emptyCount = 0
		var passagesInMonth = Object.keys(dtpm).filter(function (key) {
			return key.startsWith(month + '/')
		}).map(function (dayString) {
			var passage = (dtpm[dayString][bookmark - 1] || 'x').trim()
			if (passage === 'x') {
				emptyCount++
			}
			return passage
		})

		var dayHtmlArr = passagesInMonth.map(getBibleHtml(passage))
		var rightDays = dayHtmlArr.length === expectedDays
		var passageNamesConcat = passagesInMonth.map(function (passage) {
			return passage === 'x' ? '<span style="color:red">EMPTY</span>' : passage
		}).join(' | ')
		var monthHtml = '' //dayHtmlArr.join('\n')

		var outputHtml = `
			<div style="border:3px solid blue;background-color:#eee;">
				${dayHtmlArr.length} days for bookmark ${bookmark}, month ${month}<br>
				<div style="color:red;">${rightDays ? '' : 'Expected ' + expectedDays + ' days'}</div>
				<div style="color:red;">${emptyCount ? emptyCount + ' days are empty' : ''}</div>
				${passageNamesConcat}
			</div>
			${monthHtml}
		`

		res.write(outputHtml)
	}
}
res.end('</body></html>')
