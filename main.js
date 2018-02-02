(function () {

	var dateInput = document.getElementById('date')
	var now = new Date()
	var qsDate = /[?&]date=(\d{4}-\d\d-\d\d)/.exec(location.search)
	if (qsDate) {
		now = new Date(qsDate[1])
	}
	dateInput.value = getLocalISODateString(now)

	var today = pad(now.getMonth() + 1) + '/' + pad(now.getDate())
	document.title = 'Bible In A Year - ' + today

	xhr('./passages/' + today + '.html', function (err, result) {
		if (err) {
			alert(err.message)
			throw err
		}

		document.getElementById('content').innerHTML = result.text
	})


	function getLocalISODateString(date) {
		var year = now.getFullYear()
		var month = pad(now.getMonth() + 1)
		var day = pad(now.getDate())
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