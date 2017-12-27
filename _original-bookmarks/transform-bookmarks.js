const fs = require('fs')
const parse = require('./parser.js')
const bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')
const mainJs = fs.readFileSync(__dirname + '/../main.js', 'utf-8')

var result = parse(bookmarksTxt)
var json = JSON.stringify(result)
	.replace(/\],/g, '],\n\t\t')
	.replace('{"', '{\n\t\t"')
	.replace(']}', ']\n\t}')

const unchangingMainJsCode = mainJs.replace(/\/\* CHANGES BELOW THIS LINE WILL BE OVERWRITTEN[\s\S]+$/, '')
const newMainJs = unchangingMainJsCode +
`/* CHANGES BELOW THIS LINE WILL BE OVERWRITTEN
Make changes to bible-in-a-year/_original-bookmarks/bookmarks.txt */

function getPassages(day) {
	var dayToPassagesMap = ${json}
	return dayToPassagesMap[day]
}
`

fs.writeFileSync(__dirname + '/../main.js', newMainJs)
