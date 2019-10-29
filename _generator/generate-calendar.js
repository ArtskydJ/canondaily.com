const { monthNames, shortMonthNames, expectedMonthLength } = require('./constant/months.json')

// The calendar needs to be re-generated yearly.
module.exports = function generateCalendar(year) { // year e.g. 2019
	var jan1 = new Date(year, 0)
	jan1.setUTCHours(0)
	var dayOfWeek = (jan1.getDay() + 1) % 7

	var resultHtml = ''

	resultHtml += '<a class="cal-today" href="">Today</a>'
	if (dayOfWeek) {
		resultHtml += `<div class="cal-date-spacer" style="grid-column-end:${dayOfWeek + 1};"></div>`
	}

	for (var month = 1; month <= 12; month++) {
		for (var day = 1; day <= expectedMonthLength[month]; day++) {
			resultHtml += `<a class="cal-date" href="/${monthNames[month]}/${day}" data-month="${month}" data-day="${day}">
				${shortMonthNames[month]}<br>${day}
			</a>`.replace(/\s+/g, ' ') + '\n'
				//<div class="checkmark"></div>
		}
	}
	return `<div id="calendar">${ resultHtml }</div>
		<script>
			var monthNames = ${ JSON.stringify(monthNames) }

			function updateToday() {
				var eleToday = document.querySelector('a.cal-today')
				var d = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
				eleToday.href = '/' + d.replace(' ', '/')
			}

			updateToday()

			setInterval(updateToday, 1000)

			Array.prototype.forEach.call(document.querySelectorAll('a.cal-date'), function(dateEle){
				var month = localStorage.getItem( dateEle.dataset.month )
				var day = null
				if (month) {
					dayStatus = JSON.parse(month)[ dateEle.dataset.day ]
				}
				if (dayStatus === 1) {
					dateEle.classList.add('completed')
				}
			})

			document.getElementById('calendar').oncontextmenu = function (ev) {
				var dateEle = ev.target
				//console.log('ev', ev)
				if (dateEle.classList.contains('cal-date')) {
					ev.preventDefault()
					ev.stopPropagation()
					var completed = dateEle.classList.contains('completed')
					markDayAs(dateEle.dataset.month, dateEle.dataset.day, !completed)
					if (completed) {
						dateEle.classList.remove('completed')
					} else {
						dateEle.classList.add('completed')
					}
				}
			}

			function readSavedMonth(month) {
				return JSON.parse(localStorage.getItem(month) || '[]')
			}
			function writeSavedMonth(month, monthData) {
				localStorage.setItem(month, JSON.stringify(monthData))
			}

			function markDayAs(month, day, complete){
				var monthData = readSavedMonth(month)
				var wasComplete = monthData[day] === 1
				monthData[day] = complete ? 1 : 0
				writeSavedMonth(month, monthData)
			}
		</script>
	`
}
