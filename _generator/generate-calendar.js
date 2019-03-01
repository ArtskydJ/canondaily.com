var monthNames = [,'January','February','March','April','May','June',
	'July','August','September','October','November','December']
const shortMonthNames = [,'Jan','Feb','Mar','Apr','May','June',
	'July','Aug','Sep','Oct','Nov','Dec']
var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]

// The calendar needs to be re-generated yearly.
module.exports = function generateCalendar(year) { // year e.g. 2019
	var jan1 = new Date(year, 0)
	jan1.setUTCHours(0)
	var dayOfWeek = (jan1.getDay() + 1) % 7

	var resultHtml = ''

	resultHtml += '<a class="today" href="">Today</a>'
	if (dayOfWeek) {
		resultHtml += `<div class="date-spacer" style="grid-column-end:${dayOfWeek + 1};"></div>`
	}

	for (var month = 1; month <= 12; month++) {
		for (var day = 1; day <= expectedMonthLength[month]; day++) {
			resultHtml += `<a class="date" href="/${monthNames[month]}/${day}">
				${shortMonthNames[month]}<br>${day}
			</a>`
				//<div class="checkmark"></div>
		}
	}
	return `<div id="calendar">${resultHtml}</div>
		<script>
			var monthNames = [,'January','February','March','April','May','June',
				'July','August','September','October','November','December']

			function updateToday() {
				var eleToday = document.querySelector('a.today')
				var d = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
				eleToday.href = '/' + d.replace(' ', '/')
			}

			updateToday()

			setInterval(updateToday, 1000)
		</script>
	`
}
