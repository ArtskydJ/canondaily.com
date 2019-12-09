const cliOpts = parseCliOptions( process.argv.slice(2) )

if (cliOpts.help || ! cliOpts.run) {
	console.log('Usage:')
	console.log('node index { --help | --run [--debug] }')
	process.exit( cliOpts.help ? 0 : 1)
}

const fs = require('fs')
const path = require('path')

const mustache = require('art-template')

const parseBookmarks = require('./bookmarks-parser.js')
const parseReference = require('./parse-reference.js')
const getBibleHtml = require('./get-bible-html.js')
const hashCss = require('./hash-css.js')
const proudVsBroken = require('./constant/proud-vs-broken.json')
const meditate = require('./constant/meditate.json')

const bookmarksTxt = fs.readFileSync(__dirname + '/constant/bookmarks.txt', 'utf-8')
const dtpm = parseBookmarks(bookmarksTxt)
// console.log(JSON.stringify(dtpm, null, 2));process.exit()

const { monthNames, expectedMonthLength, shortMonthNames } = require('./constant/months.json')

const revHash = hashCss()

writeSubtemplate('index.html', {
	subtemplate: './calendar.art',
	title: 'Canon Daily',
	revHash,
	range,
	expectedMonthLength,
	monthNames,
	monthNamesJson: JSON.stringify(monthNames),
	shortMonthNames,
	dayOfWeek: getDayOfWeekOffset(),
})

writeSubtemplate('prayer-for-filling-of-spirit.html', {
	subtemplate: './prayer-for-filling-of-spirit.art',
	title: 'Prayer for the Filling of the Spirit - Canon Daily',
	revHash
})

for (var month = 1; month <= 12; month++) {
	for (var day = 1; day <= expectedMonthLength[month]; day++) {
		generateDayHtml(month, day)

		if (cliOpts.debug && day >= 3) { // debug
			// generateDayHtml(12, 1)
			// generateDayHtml(12, 2)
			// generateDayHtml(12, 3)
			console.log('\nSkipping the daily pages other than Jan 1,2,3')
			console.log('Open localcanondaily.com in your browser.\n')
			process.exit(0)
		}
	}
}

function generateDayHtml(month, day) {
	let backUrl = './' + (day - 1)
	if (month === 1 && day === 1) {
		backUrl = '../December/31'
	} else if (day === 1) {
		backUrl = '../' + monthNames[month - 1] + '/' + expectedMonthLength[month - 1]
	}
	let nextUrl = './' + (day + 1)
	if (month === 12 && day === 31) {
		nextUrl = '../January/1'
	} else if (day === expectedMonthLength[month]) {
		nextUrl = '../' + monthNames[month + 1] + '/1'
	}

	writeSubtemplate(monthNames[month] + '/' + day + '.html', {
		subtemplate: './day.art',
		title: monthNames[month] + ' ' + day + ' - Canon Daily',
		revHash,
		month,
		day,
		proudVsBroken: proudVsBroken[day - 1],
		meditate: meditate[day - 1],
		bibleHtml: dtpm.map( d => d[month][day] ).map(parseReference).map(getBibleHtml).join('\n'),
		monthNames,
		expectedMonthLength,
		backUrl,
		nextUrl,
	})
	
}

function parseCliOptions(args) {
	return args.reduce((memo, arg) => {
		memo[ arg.replace(/^--/, '').toLowerCase() ] = true
		return memo
	}, {})
}

function writeSubtemplate(resultName, data) {
	const templateHtmlPath = path.resolve(__dirname, 'template', 'master.art')
	const resultHtmlPath = path.resolve(__dirname, '..', resultName)
	const resultHtml = mustache(templateHtmlPath, data)
	fs.writeFileSync(resultHtmlPath, resultHtml, 'utf-8')
}

function range(start, end) {
	return Array(end - start + 1).fill().map((_, i) => i + start) // *new* Array?
}

function getDayOfWeekOffset() {
	const year = new Date().getUTCFullYear()
	const jan1 = new Date(year, 0)
	jan1.setUTCHours(0)
	return (jan1.getDay() + 1) % 7
}
