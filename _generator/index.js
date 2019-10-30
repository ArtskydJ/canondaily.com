global.DEBUG = false

var fs = require('fs')
var path = require('path')

const mustache = require('art-template')

var parseBookmarks = require('./bookmarks-parser.js')
var getBibleHtml = require('./get-bible-html.js')
var proudVsBroken = require('./constant/proud-vs-broken.json')
var meditate = require('./constant/meditate.json')

var bookmarksTxt = fs.readFileSync(__dirname + '/constant/bookmarks.txt', 'utf-8')
var dtpm = parseBookmarks(bookmarksTxt)

const { monthNames, expectedMonthLength, shortMonthNames } = require('./constant/months.json')

writeSubtemplate('calendar.art', 'index.html', {
	range: range,
	range12: range(1, 12),
	expectedMonthRange: expectedMonthLength.map(len => len && range(1, len)),
	monthNames,
	shortMonthNames,
	dayOfWeek: getDayOfWeekOffset(),
	title: 'Canon Daily'
}) // , generateCalendar(new Date().getFullYear())
writeSubtemplate('prayer-for-filling-of-spirit.art', 'prayer-for-filling-of-spirit.html', {
	title: 'Prayer for the Filling of the Spirit - Canon Daily'
})

for (var month = 1; month <= 12; month++) {
	for (var day = 1; day <= expectedMonthLength[month]; day++) {
		// pvb
		var pvbIdx = day - 1
		if (pvbIdx >= proudVsBroken.length) { // there are 30 proud-vs-broken items
			pvbIdx -= Math.floor(proudVsBroken.length / 3)
		}
		writeSubtemplate('day.art', monthNames[month] + '/' + day + '.html', {
			title: monthNames[month] + ' ' + day + ' - Canon Daily',
			month,
			day,
			proud: proudVsBroken[pvbIdx][0],
			broken: proudVsBroken[pvbIdx][1],
			meditate: meditate[day - 1],
			bibleHtml: dtpm[month + '/' + day].map(getBibleHtml).join('\n'),
			monthNames,
			expectedMonthLength,
		})

		if (global.DEBUG && day >= 3) { // debug
			console.log('\nSkipping the daily pages other than Jan 1,2,3')
			console.log('Open localcanondaily.com in your browser.\n')
			process.exit(1)
		}
	}
}

function writeSubtemplate(templateName, resultName, data) {
	const templateHtmlPath = path.resolve(__dirname, 'template', 'master.art')
	const resultHtmlPath = path.resolve(__dirname, '..', resultName)
	const extendedData = Object.assign({
		JSONstringify: a => JSON.stringify(a),
		expectedMonthLength,
		monthNames,
		subtemplate: './' + templateName,
	}, data)
	const resultHtml = mustache(templateHtmlPath, extendedData)
	fs.writeFileSync(resultHtmlPath, resultHtml, 'utf-8')
}

function range(start, end) {
	return Array(end - start + 1).fill().map((_, i) => i + start)
}

function getDayOfWeekOffset() {
	const year = new Date().getUTCFullYear()
	const jan1 = new Date(year, 0)
	jan1.setUTCHours(0)
	return (jan1.getDay() + 1) % 7
}
