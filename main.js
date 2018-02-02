(function () {

	var dateInput = document.getElementById('date')
	var day = new Date()
	var today = ''

	var qsDate = /[?&]date=(\d{4}-\d\d-\d\d)/.exec(location.search)
	if (qsDate) {
		day = new Date(qsDate[1])
		dateInput.value = qsDate[1]
		today = pad(day.getUTCMonth() + 1) + '/' + pad(day.getUTCDate())
	} else {
		dateInput.value = getLocalISODateString(day)
		today = pad(day.getMonth() + 1) + '/' + pad(day.getDate())
	}

	document.title = 'Bible In A Year - ' + today

	xhr('./passages/' + today + '.html', function (err, result) {
		var contentHtml = ''
		if (err) {
			document.getElementById('background-message').innerHTML = err.message
		} else if (!result.ok) {
			document.getElementById('background-message').innerHTML = result.status + ' ' + result.statusText
		} else {
			document.getElementById('content').innerHTML = result.text
		}
	})


	function getLocalISODateString(date) {
		var year = date.getFullYear()
		var month = pad(date.getMonth() + 1)
		var day = pad(date.getDate())
		return year + '-' + month + '-' + day
	}

	function pad(num) {
		return ('0' + num).slice(-2)
	}

	function xhr(url, cb) {
		var req = new XMLHttpRequest()
		req.open('GET', url, true)
		req.onerror = cb
		req.onload = function onload() {
			cb(null, {
				ok: (req.status >= 200 && req.status < 300),
				status: req.status,
				statusText: req.statusText,
				url: req.responseURL,
				text: req.responseText
			})
		}

		req.send()
	}

})()