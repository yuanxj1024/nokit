	###*
	 * An throttle version of `Q.all`, it runs all the tasks under
	 * a concurrent limitation.
	 * @param  {Int} limit The max task to run at the same time. It's optional.
	 * Default is Infinity.
	 * @param  {Array | Function} list
	 * If the list is an array, it should be a list of functions or promises. And each function will return a promise.
	 * If the list is a function, it should be a iterator that returns a promise,
	 * when it returns `undefined`, the iteration ends.
	 * @param {Boolean} save_resutls Whether to save each promise's result or not.
	 * @return {Promise} You can get each round's results by using the `promise.progress`.
	###
	async: (limit, list, save_resutls = true) ->
		from = 0
		resutls = []
		iter_index = 0
		running = 0
		is_iter_done = false
		defer = Q.defer()

		if not _.isNumber limit
			save_resutls = list
			list = limit
			limit = Infinity

		if _.isArray list
			list_len = list.length - 1
			iter = (i) ->
				return if i > list_len
				if _.isFunction list[i]
					list[i](i)
				else
					list[i]

		else if _.isFunction list
			iter = list
		else
			throw new Error('unknown list type: ' + typeof list)
