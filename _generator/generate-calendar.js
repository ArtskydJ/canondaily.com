const monthNames = [,'January','February','March','April','May','June',
	'July','August','September','October','November','December']
var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]

module.exports = function generateCalendar(year) { // year e.g. 2019
	var jan1ms = new Date(year, 0)
	jan1ms.setUTCHours(0)

	var resultHtml = ''
	for (var month = 1; month <= 12; month++) {
		for (var day = 1; day <= expectedMonthLength[month]; day++) {
			resultHtml += `<a class="date" href="/${monthNames[month]}/${day}">${monthNames[month]} ${day}
				<div class="checkmark"></div>
			</a>`
		}
	}
	return `<div id="calendar">${resultHtml}</div>`
}
