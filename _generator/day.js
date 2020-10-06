(function() {
	function updateCheckboxUI(bool) {
		document.getElementById('cm').style.display = bool ? 'inline' : 'none'
	}

	function readSavedMonth(month) {
		return JSON.parse(localStorage.getItem(month) || '[]')
	}
	function writeSavedMonth(month, monthData) {
		localStorage.setItem(month, JSON.stringify(monthData))
	}

	function markDayAsComplete(month, day) {
		const monthData = readSavedMonth(month)
		// var wasComplete = monthData[day] === 1
		monthData[day] = 1
		writeSavedMonth(month, monthData)
		updateCheckboxUI(monthData[day])
	}

	function init(month, day) {
		const monthData = readSavedMonth(month)
		if (monthData.length === 0) {
			for (let i = 0; i <= 31; i++) {
				monthData.push(0)
			}
			writeSavedMonth(month, monthData)
		}
		updateCheckboxUI(monthData[day])
	}

	function updateIsTodayUI() {
		const eleMonthAndDay = document.getElementById('month-and-day')

		eleMonthAndDay.classList[isRelativeDay(-1) ? 'add' : 'remove' ]('yesterday')
		eleMonthAndDay.classList[isRelativeDay(0)  ? 'add' : 'remove' ]('today')
		eleMonthAndDay.classList[isRelativeDay(1)  ? 'add' : 'remove' ]('tomorrow')
	}

	function isRelativeDay(offsetDays) {
		const offsetDate = new Date()
		offsetDate.setDate(offsetDate.getDate() + offsetDays)
		const todayDateParts = new Date().toLocaleDateString('en-US', { month: 'numeric', day:'numeric' }).split('/')
		return .map(Number) === '{{monthNames[month]}} {{day}}'
	}

	updateIsTodayUI()

	setInterval(updateIsTodayUI, 1000)


	window.markDayAsComplete = markDayAsComplete
	window.init = init
})()

/*

	window.init(Number('{{month}}'), Number('{{day}}'))

*/
