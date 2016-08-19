class exports.spinnerView extends Layer
	viewArray: []
	circleArray: []
	backgroundArray: []

	isSpinning = false

	constructor: (@options={}) ->
		@options.duration ?= 3
		@options.dotSize ?= 40
		@options.dotCount ?= 4
		@options.loaderHeight ?= 160
		@options.dotColor ?= "#fff"
		@options.width = 0
		@options.height = 0
		@options.opacity = 0
		@options.hasBackgroundColor ?= ""
		@options.backgroundOpacity ?= 1

		super @options

		@.centerX()
		@.centerY()
		@.y = @.y - 20
		@.x = @.x - 20

		@.states.add
			hide:
				opacity: 0
			show:
				opacity: 1

		@.states.animationOptions =
		    time: .44

		if @options.hasBackgroundColor isnt ""
			immersiveBG = new Layer
				width: Screen.width
				height: Screen.height
				backgroundColor: @options.hasBackgroundColor
				opacity: @options.backgroundOpacity

			immersiveBG.sendToBack()

			immersiveBG.states.add
				hide:
					opacity: 0
				show:
					opacity: @options.backgroundOpacity

			immersiveBG.states.animationOptions =
			    time: .44

			immersiveBG.states.switchInstant "hide"

			@backgroundArray.push(immersiveBG)


		containerAnimation = new Animation
			layer: @
			properties:
				rotation: @.rotation + 360
			curve: "linear"
			repeat: 1000
			time: @options.duration * 0.932


		# resets the animation on Stop
		@.on Events.StateDidSwitch, (from, to, states) ->
			if to is "hide"
				for i in [0...@options.dotCount]
					@viewArray[i].destroy()
					@circleArray[i].destroy()

				@circleArray = []
				@viewArray = []

				# Reset
				@.rotation = 0
				containerAnimation.stop()

		@.on Events.StateWillSwitch, (from, to, states) ->
			if to is "show"
				containerAnimation.start()

	circleAnimation: ->
		for i in [0...@viewArray.length]
			offset = Utils.round(i * 0.1 + 0.05, 2)

			@viewArray[i].animate
				properties:
					rotation: @viewArray[i].rotation + 180
				delay: offset
				time: @options.duration / 4 + 0.3
				curve: "ease-in-out"

			scaleAnimationA = new Animation
				layer: @circleArray[i]
				properties:
					scale: 0.44
				delay: offset / 2
				time: @options.duration / 8 + 0.15
				curve: "ease-in-out"

			scaleAnimationB = scaleAnimationA.reverse()

			scaleAnimationA.on(Events.AnimationEnd, scaleAnimationB.start)
			scaleAnimationA.start()


	start: ->
		return if isSpinning is true

		isSpinning = true

		if @options.hasBackgroundColor isnt ""
			@backgroundArray[0].states.switch "show"

		for i in [0...@options.dotCount]
			v = new Layer
				height: @options.dotSize
				width: @options.dotSize
				x: -@options.dotSize/2
				y: -@options.dotSize/2
				backgroundColor: "transparent"

			@viewArray.push(v)

			@.addChild(v)

			c = new Layer
				height: @options.dotSize
				width: @options.dotSize
				backgroundColor: @options.dotColor
				y: -@options.loaderHeight / 2
				borderRadius: @options.dotSize / 2

			@circleArray.push(c)
			v.addChild(c)

		@circleAnimation()
		@.states.switch "show"

		self = @
		# Check when the last animation ended and start again
		@viewArray[@options.dotCount-1].on Events.AnimationEnd, ->
			self.circleAnimation()


	stop: ->
		return if isSpinning is false
		isSpinning = false

		@.states.switch "hide"

		if @options.hasBackgroundColor isnt ""
			@backgroundArray[0].states.switch "hide"
