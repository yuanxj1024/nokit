_ = require 'lodash'

codes = {
	reset: [0, 0],

	bold: [1, 22],
	dim: [2, 22],
	italic: [3, 23],
	underline: [4, 24],
	inverse: [7, 27],
	hidden: [8, 28],
	strikethrough: [9, 29],

	black: [30, 39],
	red: [31, 39],
	green: [32, 39],
	yellow: [33, 39],
	blue: [34, 39],
	magenta: [35, 39],
	cyan: [36, 39],
	white: [37, 39],
	gray: [90, 39],
	grey: [90, 39],

	bgBlack: [40, 49],
	bgRed: [41, 49],
	bgGreen: [42, 49],
	bgYellow: [43, 49],
	bgBlue: [44, 49],
	bgMagenta: [45, 49],
	bgCyan: [46, 49],
	bgWhite: [47, 49]
}

genBrush = (code) -> (str) ->
	if module.exports.isEnabled
		code.open + str + code.close
	else
		str

module.exports = {}

for k, v of codes
	module.exports[k] = genBrush {
		open: '\u001b[' + v[0] + 'm'
		close: '\u001b[' + v[1] + 'm'
	}

module.exports.isEnabled = process.env.NODE_ENV != 'production'

module.exports.random = (str) ->
	color = _.sample(['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey'])

	return module.exports[color](str)
