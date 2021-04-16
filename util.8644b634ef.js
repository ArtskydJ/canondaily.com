(function() {
	function updateCheckboxUI(bool) {
		document.getElementById('cm').style.display = bool ? 'inline' : 'none'
	}

	function ensureLength(monthData) {
		while (monthData.length <= 31) {
			monthData.push(0)
		}
		return monthData
	}
	function readSavedMonth(month) {
		const monthJson = localStorage.getItem(month)
		return ensureLength(monthJson ? JSON.parse(monthJson) : [])
	}
	function writeSavedMonth(month, monthData) {
		localStorage.setItem(month, JSON.stringify(ensureLength(monthData)))
	}

	function markMonthAs(month, complete){
		var monthData = readSavedMonth(month)
		writeSavedMonth(month, monthData.map(function(){ return complete ? 1 : 0 }))
	}

	function markDayAsComplete(month, day) {
		const monthData = readSavedMonth(month)
		// var wasComplete = monthData[day] === 1
		monthData[day] = 1
		writeSavedMonth(month, monthData)
		updateCheckboxUI(monthData[day])
	}

	function initDayPage(month, day) {
		const monthData = readSavedMonth(month)
		updateCheckboxUI(monthData[day])

		updateIsTodayUI(month, day)
		setInterval(updateIsTodayUI, 1000, month, day)
	}

	function updateIsTodayUI(month, day) {
		const eleMonthAndDay = document.getElementById('month-and-day')

		eleMonthAndDay.classList[isRelativeDay(month, day, -1) ? 'add' : 'remove' ]('yesterday')
		eleMonthAndDay.classList[isRelativeDay(month, day, 0)  ? 'add' : 'remove' ]('today')
		eleMonthAndDay.classList[isRelativeDay(month, day, 1)  ? 'add' : 'remove' ]('tomorrow')
	}

	function isRelativeDay(month, day, offsetDays) {
		const offsetDate = new Date()
		offsetDate.setDate(offsetDate.getDate() + offsetDays)
		const offsetDayString = offsetDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
		return offsetDayString === month + '/' + day
	}

	window.markMonthAs = markMonthAs
	window.markDayAsComplete = markDayAsComplete
	window.initDayPage = initDayPage
})()
