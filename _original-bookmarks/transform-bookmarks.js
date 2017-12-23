const fs = require('fs')
const parse = require('./parser.js')
const bookmarksTxt = fs.readFileSync(__dirname + '/bookmarks.txt', 'utf-8')

var result = parse(bookmarksTxt)

const newIndexHtml = 'window.dayToPassagesMap = \n' + JSON.stringify(result).replace(/\],/g, '],\n')
fs.writeFileSync(__dirname + '/../dayToPassagesMap.js', newIndexHtml)
