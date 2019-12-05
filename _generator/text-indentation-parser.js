module.exports = function parse(bookStructureTxt) {
	return bookStructureTxt.split('\n').reduce(function (result, line) {
		var text = line.replace(/^\t+/, '')
		if ( text.startsWith('--') ) return result // comment
		var child = result
		var tabCount = line.length - text.length
		for (var i = 0; i < tabCount; i++) {
			child = child[ child.length - 1 ].children
		}
		child.push({ text, children: [] })
		return result
	}, [])
}
