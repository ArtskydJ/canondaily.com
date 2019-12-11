module.exports = function parse(text) {
	return text.split('\n').reduce(function (result, line) {
		var text = line.replace(/^\t+/, '')
		var tabCount = line.length - text.length
		text = text.split('--')[0].trim()
		if ( text === '' ) return result
		var child = result
		for (var i = 0; i < tabCount; i++) {
			child = child[ child.length - 1 ].children
		}
		child.push({ text: text, children: [] })
		return result
	}, [])
}
