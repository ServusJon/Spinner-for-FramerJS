# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: "Simple Spinner"
	author: "Jonathan Arnold"
	twitter: "@servusjon"
	description: "This spinner can be easily integrated in your projects. Learn more: https://github.com/ServusJon/Spinner-for-FramerJS"

isSpinning = true
{spinnerView} = require "spinner"

spinner = new spinnerView
	hasBackgroundColor: "#641EFE"

spinner.start()

# Toggle Button
btnToggleSpinner = new Layer
	html: "Stop Spinner"
	width: 400
	height: 120
	borderRadius: 10
	backgroundColor: "#fff"
	color: "#641EFE"

btnToggleSpinner.centerX()
btnToggleSpinner.y = Screen.height - 120 - 62
btnToggleSpinner.style =
	textAlign: "center"
	lineHeight: "120px"
	fontSize: "42px"
	
btnToggleSpinner.states.add
	stop:
		backgroundColor: "#641EFE"
		color: "#fff"
	start:
		backgroundColor: "#fff"
		color: "#641EFE"
		
btnToggleSpinner.onTap ->
	if isSpinning
		spinner.stop()
		
		@.states.switchInstant "stop"
		
		btnToggleSpinner.html = "Start Spinner"
		isSpinning = false
	else
		spinner.start()
		
		@.states.switchInstant "start"
		
		btnToggleSpinner.html = "Stop Spinner"
		isSpinning = true
