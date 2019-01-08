var fs = require('fs')
var parse = require('./bookmarks-parser.js')
var getBibleHtml = require('./get-bible-html.js')
var proudVsBroken = require('./proud-vs-broken.json')
var meditate = require('./meditate.json')

var monthNames = [,'January','February','March','April','May','June',
	'July','August','September','October','November','December']
var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]

var bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')
var dtpm = parse(bookmarksTxt)

for (var month = 1; month <= 12; month++) {
	for (var day = 1; day <= expectedMonthLength[month]; day++) {
		var passages = dtpm[month + '/' + day]
		// console.log(passages)

		var dayHtml =
			getDayNameHtml(month, day) +
			passages.map(getBibleHtml).join('\n') +
			getProudVsBrokenHtml(day) +
			getMeditationHtml(day)

		fs.writeFileSync(__dirname + `/../passages/${pad(month)}/${pad(day)}.html`, dayHtml)
	}
}

function pad(num) {
	return ('0' + num).slice(-2)
}

function getDayNameHtml(month, day) {
	return `
	<div class="section subsection dark-bg">
		<div class="header">${monthNames[month]} ${day}</div>
	</div>`
}

function getProudVsBrokenHtml(day) {
	var index = day - 1
	if (index >= proudVsBroken.length) { // there are 30 proud-vs-broken items
		index -= Math.floor(proudVsBroken.length / 3)
	}
	return `
	<div class="section subsection dark-bg">
		<div class="header">Proud VS Broken</div>
		<div>
			<div class="subheader">Proud</div>
			${proudVsBroken[index][0]}
		</div>
		<div>
			<div class="subheader">Broken</div>
			${proudVsBroken[index][1]}
		</div>
	</div>`
}

function getMeditationHtml(day) {
	var bibleSection = meditate[day - 1]
	return `
	<div class="section subsection">
		<div class="header">Meditate on this</div>
		<div class="subheader">${bibleSection.passage} ${bibleSection.version}</div>
		${bibleSection.text}
	</div>
	`
}
