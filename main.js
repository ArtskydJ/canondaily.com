var dayToPassagesMap = window.dayToPassagesMap
if (!dayToPassagesMap) throw new Error('uh oh......')


var now = new Date()
var dateInput = document.getElementById('date')
var qsDate = /[?&]date=(\d{4}-\d\d-\d\d)/.exec(location.search)
if (qsDate) {
	now = new Date(qsDate[1])
}
dateInput.value = now.toISOString().slice(0, 10)

var today = (now.getUTCMonth() + 1) + '/' + now.getUTCDate()
var passages = dayToPassagesMap[today]
var passageIndex = 0

function setPassage(offset) {
	var prev = document.querySelector('.previous')
	var next = document.querySelector('.next')
	var iframeEle = document.getElementById('iframe')
	var passageEle = document.getElementById('passage')

	if (passages) {
		var nextPassageIndex = Math.min(3, Math.max(0, passageIndex + offset))
		if (offset === 0 || nextPassageIndex !== passageIndex) {
			passageIndex = nextPassageIndex
			var passage = passages[passageIndex]
			passageEle.innerHTML = 'Bookmark ' + (passageIndex + 1)
			document.title = 'Bible In A Year - ' + today + ' - ' + passage
			iframeEle.src = 'https://www.biblegateway.com/passage/?version=NKJV&interface=print&search=' + encodeURIComponent(passage)
		}

		prev.classList.remove('disabled')
		next.classList.remove('disabled')
		if (passageIndex === 0) prev.classList.add('disabled')
		if (passageIndex === 3) next.classList.add('disabled')
	} else {
		passageEle.innerHTML = 'No passage found!'
		document.title = 'Bible In A Year - ' + today + ' - No passage found!'

		iframeEle.srcdoc = '<h1 style="font-family:Calibri,sans-serif;text-align:center;width:calc(100vw - 8px);position:absolute;top:45vh;">No passage found!</h1>'

		prev.classList.add('disabled')
		next.classList.add('disabled')
	}
}

setPassage(0)