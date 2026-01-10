var textIndentationParser = require('./text-indentation-parser.js')

module.exports = function parse(bookmarksTxt) {
	return textIndentationParser(bookmarksTxt).map(function (bookmark) {
		var months = bookmark.children.map(function (month) {
			var days = month.children.map(function (passageLine) {
				return passageLine && passageLine.text.trim()
			})
			days.unshift( null ) // make days 1-indexed
			return days
		})
		months.unshift( null ) // make months 1-indexed
		return months
	})
}
