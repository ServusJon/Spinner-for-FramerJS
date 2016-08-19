# Spinner Module For Your Framerjs Prototypes
I built this spinner module so you can easily integrate it in your prototypes:
[See it in Action](http://share.framerjs.com/v4lsjrty3u0m/)

<img src="https://raw.githubusercontent.com/ServusJon/Spinner-for-FramerJS/master/spinner.gif" alt="Spinner" width="400">

This spinner is inspired by the spinner from Skype. Thank you [Travis Kirton](https://twitter.com/postfl) for [sharing this tutorial](http://www.c4ios.com/tutorials/skype)

## Setup
1. Download the `spinner.coffee` file
2. Create or open a framer project and drop spinner.coffee inside the /modules folder
3. Add `{spinnerView} = require 'spinner' at the top of your document (case-sensitive).

## Add Spinner
```coffeescript
spinner = new spinnerView
```

## Start Spinner
```coffeescript
spinner.start()
```

## Stop / Hide Spinner
```coffeescript
spinner.stop()
```

## Optional Properties
You can also customize the spinner and its background with following properties:

| property  | Description|
| ------------- | ------------- |
| `dotSize`  | The size of each dot in the animation (default: 40)  |
| `dotColor`  | The color of the dots (default: "#fff")  |
| `loaderHeight`  | Size of the spin animation  |
| `hasBackgroundColor`  | Backdrop color of the animation. If not set there is no backgroundcolor (default: "")  |
| `backgroundOpacity`  | Backdrop opacity  (default: 1)  |

```coffeescript
spinner = new spinnerView
	dotSize: 200
	dotColor: "#ccc"
	loaderHeight: 300
	hasBackgroundColor: "#641EFE"
	backgroundOpacity: 0.5
```