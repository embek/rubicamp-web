const { readFileSync } = require('node:fs')
const html = readFileSync('index.html', 'utf-8')

function layout(content) {
    return html.replace('#content#', content)
}

module.exports = { layout }