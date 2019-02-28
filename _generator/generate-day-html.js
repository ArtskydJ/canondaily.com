var fs = require('fs')
var parseBookmarks = require('./bookmarks-parser.js')
var getBibleHtml = require('./get-bible-html.js')
var proudVsBroken = require('./proud-vs-broken.json')
var meditate = require('./meditate.json')
// var generateCalendar = require('./generate-calendar.js')

var monthNames = [,'January','February','March','April','May','June',
	'July','August','September','October','November','December']

var bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')
var dtpm = parseBookmarks(bookmarksTxt)

module.exports = function generateDayHtml(month, day) {
	var passages = dtpm[month + '/' + day]

	return getDayNameHtml(month, day) +
		passages.map(getBibleHtml).join('\n') +
		getProudVsBrokenHtml(day) +
		getMeditationHtml(day) +
		getCompleteButtonHtml(month, day)
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

function getCompleteButtonHtml(month, day) {
	return `
		<div id="complete" class="section complete-button" onclick="markDayAsComplete(${month}, ${day})">
			<div class="header">
				Complete<span class="checkmark" id="cm"></span>
			</div>
		</div>

		<script>
			var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]
			var monthNames = [,'January','February','March','April','May','June',
				'July','August','September','October','November','December']

			function updateCheckbox(monthData, day) {
				document.getElementById('cm').style.display = monthData[day] ? 'inline' : 'none'
			}

			function readSavedMonth(month) {
				return JSON.parse(localStorage.getItem(month) || '[]')
			}
			function writeSavedMonth(month, monthData) {
				localStorage.setItem(month, JSON.stringify(monthData))
			}

			function markDayAsComplete(month, day){
				var monthData = readSavedMonth(month)
				var wasComplete = monthData[day] === 1
				monthData[day] = 1
				writeSavedMonth(month, monthData)
				updateCheckbox(monthData, day)
				setTimeout(function () {
					if (month === 12 && day === 31) { // end of year
						location.assign('../January/1')
					} else if (day === expectedMonthLength[month]) { // end of month
						location.assign('../' + monthNames[month + 1] + '/1')
					} else {
						location.assign('./' + (day + 1))
					}
				}, wasComplete ? 0 : 1000)
			}

			function init(month, day) {
				var monthData = readSavedMonth(month)
				if (monthData.length === 0){
					for (var i = 0; i <= 31; i++) { monthData.push(0) }
					writeSavedMonth(month, monthData)
				}
				updateCheckbox(monthData, day)
			}
			init(${month}, ${day})
		</script>
	`
}
