var fs = require('fs')
var parseBookmarks = require('./bookmarks-parser.js')
var getBibleHtml = require('./get-bible-html.js')
var proudVsBroken = require('./constant/proud-vs-broken.json')
var meditate = require('./constant/meditate.json')
// var generateCalendar = require('./generate-calendar.js')

const { monthNames, expectedMonthLength } = require('./constant/months.json')

var bookmarksTxt = fs.readFileSync(__dirname + '/constant/bookmarks.txt', 'utf-8')
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
	return `<div class="section subheader dark-bg" id="month-and-day">${monthNames[month]} ${day}</div>`
}

function getProudVsBrokenHtml(day) {
	var index = day - 1
	if (index >= proudVsBroken.length) { // there are 30 proud-vs-broken items
		index -= Math.floor(proudVsBroken.length / 3)
	}
	return `
	<div class="section dark-bg">
		<div class="subheader">Proud VS Broken</div>
		<div>
			<div class="subsubheader">Proud</div>
			${proudVsBroken[index][0]}
		</div>
		<div>
			<div class="subsubheader">Broken</div>
			${proudVsBroken[index][1]}
		</div>
	</div>`
}

function getMeditationHtml(day) {
	var bibleSection = meditate[day - 1]
	return `
	<div class="section">
		<div class="subheader">Meditate on this</div>
		<div class="subsubheader">${bibleSection.passage} ${bibleSection.version}</div>
		${bibleSection.text}
	</div>
	`
}

function getCompleteButtonHtml(month, day) {
	return `
		<div class="section complete-button" onclick="markDayAsComplete(${month}, ${day})">
			<div class="header">
				Complete<span class="checkmark" id="cm"></span>
			</div>
		</div>
		<div class="container change-day">
			<div class="prev-day" onclick="location.assign('${ calculatePrevDayUrl(month, day) }')">
				<div class="header">◄ Back</div>
			</div>
			<div class="next-day" onclick="location.assign('${ calculateNextDayUrl(month, day) }')">
				<div class="header">Next ►</div>
			</div>
		</div>

		<script>
			var expectedMonthLength = ${ JSON.stringify(expectedMonthLength) }
			var monthNames = ${ JSON.stringify(monthNames) }

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

			function updateIsToday() {
				var eleMonthAndDay = document.getElementById('month-and-day')


				var thisPageDateStr = '${monthNames[month]} ${day}'
				if (getDateStr(-1) === thisPageDateStr) {
					eleMonthAndDay.classList.add('yesterday')
				} else if (getDateStr(0) === thisPageDateStr) {
					eleMonthAndDay.classList.add('today')
				} else if (getDateStr(1) === thisPageDateStr) {
					eleMonthAndDay.classList.add('tomorrow')
				}
			}

			function getDateStr(offsetDays) {
				var offsetDate = new Date()
				offsetDate.setDate(offsetDate.getDate() + offsetDays)
				return offsetDate.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric'
				})
			}

			updateIsToday()

			setInterval(updateIsToday, 1000)
		</script>
	`
}

function calculatePrevDayUrl(month, day) {
	if (month === 1 && day === 1) { // start of year
		return '../December/31'
	} else if (day === 1) { // start of month
		return '../' + monthNames[month - 1] + '/' + expectedMonthLength[month - 1]
	} else {
		return './' + (day - 1)
	}
}

function calculateNextDayUrl(month, day) {
	if (month === 12 && day === 31) { // end of year
		return '../January/1'
	} else if (day === expectedMonthLength[month]) { // end of month
		return '../' + monthNames[month + 1] + '/1'
	} else {
		return './' + (day + 1)
	}
}
