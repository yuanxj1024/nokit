kit = require '../lib/kit'
{ _, Promise } = kit
proxy = kit.require 'proxy'
kit.require 'url'
http = require 'http'

routes = [
	(ctx) ->
		# Record the time of the whole request
		start = new Date
		ctx.next ->
			ctx.res.setHeader 'x-response-time', new Date - start

	(ctx) ->
		kit.log 'access: ' + ctx.req.url
		ctx.next

	proxy.static '/st', 'test/fixtures'

	{
		url: /\/items\/(\d+)/
		handler: (ctx) ->
			ctx.body = ctx.url
	}
]

http.createServer proxy.mid(routes)

.listen 8123, ->
	kit.log 'listen ' + 8123

	kit.spawn 'http', ['127.0.0.1:8123/items/10/asf']
