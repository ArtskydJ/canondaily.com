var getBibleHtml = require('./get-bible-html.js')

console.log(getBibleHtml('genesis 1:26'))
console.log(getBibleHtml('genesis 1:25-26'))
console.log(getBibleHtml('genesis 1:26-2:12'))

// All formatting is lost. getBibleHtml() should read and pass along these types
// - paragraph start
// - paragraph end
// - stanza start
// - stanza end
// - paragraph text
// - line
// - break
