var dayToPassagesMap = window.dayToPassagesMap

var dateInput = document.getElementById('date')
var buttons = Array.prototype.slice.call(document.querySelectorAll('.nav-button'))
var iframes = Array.prototype.slice.call(document.querySelectorAll('iframe'))

var now = new Date()
var qsDate = /[?&]date=(\d{4}-\d\d-\d\d)/.exec(location.search)
if (qsDate) {
	now = new Date(qsDate[1])
}
dateInput.value = now.toISOString().slice(0, 10)

var today = (now.getUTCMonth() + 1) + '/' + now.getUTCDate()
var passages = dayToPassagesMap[today]
var passageIndex = -1

function init() {
	if (passages) {
		iframes.forEach(function (iframe, index) {
			iframe.src = 'https://www.biblegateway.com/passage/?version=NKJV&interface=print&search=' + encodeURIComponent(passages[index])
		})
	}
}

function setPassage(nextPassageIndex) {
	if (passages && nextPassageIndex !== passageIndex) {
		passageIndex = nextPassageIndex
		var passage = passages[passageIndex]
		document.title = 'Bible In A Year - ' + today + ' - ' + passage

		buttons.forEach(function (button) { button.classList.remove('disabled') })
		buttons[passageIndex].classList.add('disabled')

		iframes.forEach(function (iframe) { iframe.classList.remove('front') })
		iframes[passageIndex].classList.add('front')

	} else if (!passages) {
		document.title = 'Bible In A Year - ' + today + ' - No passage found!'

		buttons.forEach(function (ele) { ele.classList.add('disabled') })

		document.getElementById('background-message').innerHTML = 'No passage found!'
	}
}

init()
setPassage(0)
