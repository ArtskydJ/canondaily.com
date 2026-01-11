const fs = require('fs')
const path = require('path')

const mustache = require('art-template')

const parseBookmarks = require('./bookmarks-parser.js')
const parseReference = require('./parse-reference.js')
const getBibleHtml = require('./get-bible-html.js')
const hashFile = require('./hash-file.js')
const proudVsBroken = require('./constant/proud-vs-broken.json')
const meditate = require('./constant/meditate.json')

const bookmarksTxt = fs.readFileSync(__dirname + '/constant/bookmarks.txt', 'utf-8')
const dtpm = parseBookmarks(bookmarksTxt)
// console.log(JSON.stringify(dtpm, null, 2));process.exit()

const { monthNames, expectedMonthLength, shortMonthNames } = require('./constant/months.json')

const generatedSitePath = path.join(__dirname, '..', '_site')

generateSite()

function generateSite() {
	resetSiteDir()

	const opts = {
		styleCssFileName: hashAndCopyFile(path.join(__dirname, 'style.css'), generatedSitePath),
		utilJsFileName: hashAndCopyFile(path.join(__dirname, 'util.js'), generatedSitePath),
	}

	copyDir(path.join(__dirname, 'static'), generatedSitePath)
	generateCommonFiles(opts)

	for (let rMonth = 1; rMonth <= 12; rMonth++) {
		fs.mkdirSync(path.join(generatedSitePath, monthNames[rMonth]))
		for (let rDay = 1; rDay <= expectedMonthLength[rMonth]; rDay++) {
			generateDayHtml(rMonth, rDay, opts)
		}
	}
}

function generateCommonFiles(opts) {
	const year = new Date().getUTCFullYear()
	// relative URLs so it works locally and in prod
	const styleCssUrl = `./${ opts.styleCssFileName }`
	const utilJsUrl = `./${ opts.utilJsFileName }`

	writeSubtemplate('index.html', {
		subtemplate: './calendar.art',
		title: 'Canon Daily',
		styleCssUrl,
		utilJsUrl,
		range,
		expectedMonthLength,
		monthNames,
		monthNamesJson: JSON.stringify(monthNames),
		shortMonthNames,
		dayOfWeek: getDayOfWeekOffset(year),
		leapYear: getLeapYear(year),
	})

	writeSubtemplate('prayer-for-filling-of-spirit.html', {
		subtemplate: './prayer-for-filling-of-spirit.art',
		title: 'Prayer for the Filling of the Spirit - Canon Daily',
		styleCssUrl,
	})

	writeSubtemplate('bulk-edit.html', {
		subtemplate: './bulk-edit.art',
		title: 'Bulk Edit - Canon Daily',
		styleCssUrl,
		utilJsUrl,
		range,
		expectedMonthLength,
		monthNames,
	})
}

function generateDayHtml(month, day, opts) {
	const prevMonth = ((month + 10) % 12) + 1
	const nextMonth = (month % 12) + 1

	// relative URLs so they work locally and in prod
	const backUrl = day === 1
		? `../${ monthNames[prevMonth] }/${ expectedMonthLength[prevMonth] }`
		: `./${ day - 1 }`
	const nextUrl = day === expectedMonthLength[month]
		? `../${ monthNames[nextMonth] }/1`
		: `./${ day + 1 }`
	const styleCssUrl = `../${ opts.styleCssFileName }`
	const utilJsUrl = `../${ opts.utilJsFileName }`

	writeSubtemplate(monthNames[month] + '/' + day + '.html', {
		subtemplate: './day.art',
		title: `${ monthNames[month] } ${ day } - Canon Daily`,
		styleCssUrl,
		utilJsUrl,
		month,
		day,
		proudVsBroken: proudVsBroken[day - 1],
		meditate: meditate[day - 1],
		bibleHtml: dtpm.map(d => d[month][day]).map(parseReference).map(getBibleHtml).join('\n'),
		monthNames,
		backUrl,
		nextUrl,
	})
}

function copyDir(fromDir, toDir) {
	fs.readdirSync(fromDir, { withFileTypes: true })
		.forEach(dirent => {
			const from = path.join(fromDir, dirent.name)
			const to = path.join(toDir, dirent.name)
			if (dirent.isDirectory()) {
				fs.mkdirSync(to)
				copyDir(from, to)
			} else {
				fs.copyFileSync(from, to)
			}
		})
}

function resetSiteDir() {
	fs.rmSync(generatedSitePath, { recursive: true, force: true })
	fs.mkdirSync(generatedSitePath)
}

function writeSubtemplate(resultName, data) {
	const templateHtmlPath = path.join(__dirname, 'template', 'master.art')
	const resultHtmlPath = path.join(generatedSitePath, resultName)
	const resultHtml = mustache(templateHtmlPath, data)
	fs.writeFileSync(resultHtmlPath, resultHtml, 'utf-8')
}

function hashAndCopyFile(sourceFilePath, destFileDir) {
	const { sourceFileContents, destFileName } = hashFile(sourceFilePath)
	fs.writeFileSync(path.join(destFileDir, destFileName), sourceFileContents, 'utf-8')
	return destFileName
}

function range(start, end) {
	return Array(end - start + 1).fill().map((_, i) => i + start) // *new* Array?
}

function getDayOfWeekOffset(year) {
	const jan1 = new Date(year, 0)
	jan1.setUTCHours(0)
	return (jan1.getDay() + 1) % 7
}

function getLeapYear(year) {
	// https://stackoverflow.com/a/16353241/1509389
	return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)
}
