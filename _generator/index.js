var fs = require('fs')
var path = require('path')
var generateCalendar = require('./generate-calendar.js')
var generateDayHtml = require('./generate-day-html.js')

var masterTemplateHtml = fs.readFileSync(__dirname + '/template/master-template.html', 'utf-8')
var pffosSubtemplateHtml = fs.readFileSync(__dirname + '/template/prayer-for-filling-of-spirit-subtemplate.html', 'utf-8')

const monthNames = [,'January','February','March','April','May','June',
	'July','August','September','October','November','December']
var expectedMonthLength = [,31,28,31,30,31,30,31,31,30,31,30,31]

writeSubtemplate('index', generateCalendar(new Date().getFullYear()))
writeSubtemplate('prayer-for-filling-of-spirit', pffosSubtemplateHtml, 'Prayer for the Filling of the Spirit')

if (false) { // debug
	writeSubtemplate('January/1', generateDayHtml(1, 1), 'January 1')
	writeSubtemplate('January/2', generateDayHtml(1, 2), 'January 2')
	writeSubtemplate('January/3', generateDayHtml(1, 3), 'January 3')
	console.log('\nSkipping the daily pages other than Jan 1,2,3\n')
	process.exit(1)
}

for (var month = 1; month <= 12; month++) {
	for (var day = 1; day <= expectedMonthLength[month]; day++) {
		var dayHtml = generateDayHtml(month, day)
		writeSubtemplate(monthNames[month] + '/' + day, dayHtml, monthNames[month] + ' ' + day)
	}
}

function writeSubtemplate(partialPath, subtemplateHtml, title) {
	var html = masterTemplateHtml.replace('<!-- [[SUBTEMPLATE]] -->', subtemplateHtml)
	if (title) {
		html = html.replace('<title>Canon Daily</title>', `<title>${title} - Canon Daily</title>`)
	}
	fs.writeFileSync(path.resolve(__dirname, '..', partialPath + '.html'), html)
}

