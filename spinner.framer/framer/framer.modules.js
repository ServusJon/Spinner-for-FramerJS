require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"spinner":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.spinnerView = (function(superClass) {
  var isSpinning;

  extend(spinnerView, superClass);

  spinnerView.prototype.viewArray = [];

  spinnerView.prototype.circleArray = [];

  spinnerView.prototype.backgroundArray = [];

  isSpinning = false;

  function spinnerView(options) {
    var base, base1, base2, base3, base4, base5, base6, containerAnimation, immersiveBG;
    this.options = options != null ? options : {};
    if ((base = this.options).duration == null) {
      base.duration = 3;
    }
    if ((base1 = this.options).dotSize == null) {
      base1.dotSize = 40;
    }
    if ((base2 = this.options).dotCount == null) {
      base2.dotCount = 4;
    }
    if ((base3 = this.options).loaderHeight == null) {
      base3.loaderHeight = 160;
    }
    if ((base4 = this.options).dotColor == null) {
      base4.dotColor = "#fff";
    }
    this.options.width = 0;
    this.options.height = 0;
    this.options.opacity = 0;
    if ((base5 = this.options).hasBackgroundColor == null) {
      base5.hasBackgroundColor = "";
    }
    if ((base6 = this.options).backgroundOpacity == null) {
      base6.backgroundOpacity = 1;
    }
    spinnerView.__super__.constructor.call(this, this.options);
    this.centerX();
    this.centerY();
    this.y = this.y - 20;
    this.x = this.x - 20;
    this.states.add({
      hide: {
        opacity: 0
      },
      show: {
        opacity: 1
      }
    });
    this.states.animationOptions = {
      time: .44
    };
    if (this.options.hasBackgroundColor !== "") {
      immersiveBG = new Layer({
        width: Screen.width,
        height: Screen.height,
        backgroundColor: this.options.hasBackgroundColor,
        opacity: this.options.backgroundOpacity
      });
      immersiveBG.sendToBack();
      immersiveBG.states.add({
        hide: {
          opacity: 0
        },
        show: {
          opacity: this.options.backgroundOpacity
        }
      });
      immersiveBG.states.animationOptions = {
        time: .44
      };
      immersiveBG.states.switchInstant("hide");
      this.backgroundArray.push(immersiveBG);
    }
    containerAnimation = new Animation({
      layer: this,
      properties: {
        rotation: this.rotation + 360
      },
      curve: "linear",
      repeat: 1000,
      time: this.options.duration * 0.932
    });
    this.on(Events.StateDidSwitch, function(from, to, states) {
      var i, j, ref;
      if (to === "hide") {
        for (i = j = 0, ref = this.options.dotCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          this.viewArray[i].destroy();
          this.circleArray[i].destroy();
        }
        this.circleArray = [];
        this.viewArray = [];
        this.rotation = 0;
        return containerAnimation.stop();
      }
    });
    this.on(Events.StateWillSwitch, function(from, to, states) {
      if (to === "show") {
        return containerAnimation.start();
      }
    });
  }

  spinnerView.prototype.circleAnimation = function() {
    var i, j, offset, ref, results, scaleAnimationA, scaleAnimationB;
    results = [];
    for (i = j = 0, ref = this.viewArray.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      offset = Utils.round(i * 0.1 + 0.05, 2);
      this.viewArray[i].animate({
        properties: {
          rotation: this.viewArray[i].rotation + 180
        },
        delay: offset,
        time: this.options.duration / 4 + 0.3,
        curve: "ease-in-out"
      });
      scaleAnimationA = new Animation({
        layer: this.circleArray[i],
        properties: {
          scale: 0.44
        },
        delay: offset / 2,
        time: this.options.duration / 8 + 0.15,
        curve: "ease-in-out"
      });
      scaleAnimationB = scaleAnimationA.reverse();
      scaleAnimationA.on(Events.AnimationEnd, scaleAnimationB.start);
      results.push(scaleAnimationA.start());
    }
    return results;
  };

  spinnerView.prototype.start = function() {
    var c, i, j, ref, self, v;
    if (isSpinning === true) {
      return;
    }
    isSpinning = true;
    if (this.options.hasBackgroundColor !== "") {
      this.backgroundArray[0].states["switch"]("show");
    }
    for (i = j = 0, ref = this.options.dotCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      v = new Layer({
        height: this.options.dotSize,
        width: this.options.dotSize,
        x: -this.options.dotSize / 2,
        y: -this.options.dotSize / 2,
        backgroundColor: "transparent"
      });
      this.viewArray.push(v);
      this.addChild(v);
      c = new Layer({
        height: this.options.dotSize,
        width: this.options.dotSize,
        backgroundColor: this.options.dotColor,
        y: -this.options.loaderHeight / 2,
        borderRadius: this.options.dotSize / 2
      });
      this.circleArray.push(c);
      v.addChild(c);
    }
    this.circleAnimation();
    this.states["switch"]("show");
    self = this;
    return this.viewArray[this.options.dotCount - 1].on(Events.AnimationEnd, function() {
      return self.circleAnimation();
    });
  };

  spinnerView.prototype.stop = function() {
    if (isSpinning === false) {
      return;
    }
    isSpinning = false;
    this.states["switch"]("hide");
    if (this.options.hasBackgroundColor !== "") {
      return this.backgroundArray[0].states["switch"]("hide");
    }
  };

  return spinnerView;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamFybm9sZC9naXQvU3Bpbm5lci1mb3ItRnJhbWVySlMvc3Bpbm5lci5mcmFtZXIvbW9kdWxlcy9zcGlubmVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7OztBQUFNLE9BQU8sQ0FBQztBQUNiLE1BQUE7Ozs7d0JBQUEsU0FBQSxHQUFXOzt3QkFDWCxXQUFBLEdBQWE7O3dCQUNiLGVBQUEsR0FBaUI7O0VBRWpCLFVBQUEsR0FBYTs7RUFFQSxxQkFBQyxPQUFEO0FBQ1osUUFBQTtJQURhLElBQUMsQ0FBQSw0QkFBRCxVQUFTOztVQUNkLENBQUMsV0FBWTs7O1dBQ2IsQ0FBQyxVQUFXOzs7V0FDWixDQUFDLFdBQVk7OztXQUNiLENBQUMsZUFBZ0I7OztXQUNqQixDQUFDLFdBQVk7O0lBQ3JCLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxHQUFpQjtJQUNqQixJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsR0FBa0I7SUFDbEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULEdBQW1COztXQUNYLENBQUMscUJBQXNCOzs7V0FDdkIsQ0FBQyxvQkFBcUI7O0lBRTlCLDZDQUFNLElBQUMsQ0FBQSxPQUFQO0lBRUEsSUFBQyxDQUFDLE9BQUYsQ0FBQTtJQUNBLElBQUMsQ0FBQyxPQUFGLENBQUE7SUFDQSxJQUFDLENBQUMsQ0FBRixHQUFNLElBQUMsQ0FBQyxDQUFGLEdBQU07SUFDWixJQUFDLENBQUMsQ0FBRixHQUFNLElBQUMsQ0FBQyxDQUFGLEdBQU07SUFFWixJQUFDLENBQUMsTUFBTSxDQUFDLEdBQVQsQ0FDQztNQUFBLElBQUEsRUFDQztRQUFBLE9BQUEsRUFBUyxDQUFUO09BREQ7TUFFQSxJQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQVMsQ0FBVDtPQUhEO0tBREQ7SUFNQSxJQUFDLENBQUMsTUFBTSxDQUFDLGdCQUFULEdBQ0k7TUFBQSxJ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QUMsT0FEaEI7UUFFQSxlQUFBLEVBQWlCLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFGMUI7UUFHQSxDQUFBLEVBQUcsQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVYsR0FBeUIsQ0FINUI7UUFJQSxZQUFBLEVBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULEdBQW1CLENBSmpDO09BRE87TUFPUixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsQ0FBbEI7TUFDQSxDQUFDLENBQUMsUUFBRixDQUFXLENBQVg7QUFwQkQ7SUFzQkEsSUFBQyxDQUFBLGVBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFSLENBQWdCLE1BQWhCO0lBRUEsSUFBQSxHQUFPO1dBRVAsSUFBQyxDQUFBLFNBQVUsQ0FBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsR0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxFQUFoQyxDQUFtQyxNQUFNLENBQUMsWUFBMUMsRUFBd0QsU0FBQTthQUN2RCxJQUFJLENBQUMsZUFBTCxDQUFBO0lBRHVELENBQXhEO0VBbkNNOzt3QkF1Q1AsSUFBQSxHQUFNLFNBQUE7SUFDTCxJQUFVLFVBQUEsS0FBYyxLQUF4QjtBQUFBLGFBQUE7O0lBQ0EsVUFBQSxHQUFhO0lBRWIsSUFBQyxDQUFDLE1BQU0sQ0FBQyxRQUFELENBQVIsQ0FBZ0IsTUFBaEI7SUFFQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsa0JBQVQsS0FBaUMsRUFBcEM7YUFDQyxJQUFDLENBQUEsZUFBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUExQixDQUFrQyxNQUFsQyxFQUREOztFQU5LOzs7O0dBckoyQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBleHBvcnRzLnNwaW5uZXJWaWV3IGV4dGVuZHMgTGF5ZXJcblx0dmlld0FycmF5OiBbXVxuXHRjaXJjbGVBcnJheTogW11cblx0YmFja2dyb3VuZEFycmF5OiBbXVxuXG5cdGlzU3Bpbm5pbmcgPSBmYWxzZVxuXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cdFx0QG9wdGlvbnMuZHVyYXRpb24gPz0gM1xuXHRcdEBvcHRpb25zLmRvdFNpemUgPz0gNDBcblx0XHRAb3B0aW9ucy5kb3RDb3VudCA/PSA0XG5cdFx0QG9wdGlvbnMubG9hZGVySGVpZ2h0ID89IDE2MFxuXHRcdEBvcHRpb25zLmRvdENvbG9yID89IFwiI2ZmZlwiXG5cdFx0QG9wdGlvbnMud2lkdGggPSAwXG5cdFx0QG9wdGlvbnMuaGVpZ2h0ID0gMFxuXHRcdEBvcHRpb25zLm9wYWNpdHkgPSAwXG5cdFx0QG9wdGlvbnMuaGFzQmFja2dyb3VuZENvbG9yID89IFwiXCJcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kT3BhY2l0eSA/PSAxXG5cblx0XHRzdXBlciBAb3B0aW9uc1xuXG5cdFx0QC5jZW50ZXJYKClcblx0XHRALmNlbnRlclkoKVxuXHRcdEAueSA9IEAueSAtIDIwXG5cdFx0QC54ID0gQC54IC0gMjBcblxuXHRcdEAuc3RhdGVzLmFkZFxuXHRcdFx0aGlkZTpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0c2hvdzpcblx0XHRcdFx0b3BhY2l0eTogMVxuXG5cdFx0QC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0ICAgIHRpbWU6IC40NFxuXG5cdFx0aWYgQG9wdGlvbnMuaGFzQmFja2dyb3VuZENvbG9yIGlzbnQgXCJcIlxuXHRcdFx0aW1tZXJzaXZlQkcgPSBuZXcgTGF5ZXJcblx0XHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBAb3B0aW9ucy5oYXNCYWNrZ3JvdW5kQ29sb3Jcblx0XHRcdFx0b3BhY2l0eTogQG9wdGlvbnMuYmFja2dyb3VuZE9wYWNpdHlcblxuXHRcdFx0aW1tZXJzaXZlQkcuc2VuZFRvQmFjaygpXG5cblx0XHRcdGltbWVyc2l2ZUJHLnN0YXRlcy5hZGRcblx0XHRcdFx0aGlkZTpcblx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNob3c6XG5cdFx0XHRcdFx0b3BhY2l0eTogQG9wdGlvbnMuYmFja2dyb3VuZE9wYWNpdHlcblxuXHRcdFx0aW1tZXJzaXZlQkcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdFx0ICAgIHRpbWU6IC40NFxuXG5cdFx0XHRpbW1lcnNpdmVCRy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBcImhpZGVcIlxuXG5cdFx0XHRAYmFja2dyb3VuZEFycmF5LnB1c2goaW1tZXJzaXZlQkcpXG5cblxuXHRcdGNvbnRhaW5lckFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBAXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRyb3RhdGlvbjogQC5yb3RhdGlvbiArIDM2MFxuXHRcdFx0Y3VydmU6IFwibGluZWFyXCJcblx0XHRcdHJlcGVhdDogMTAwMFxuXHRcdFx0dGltZTogQG9wdGlvbnMuZHVyYXRpb24gKiAwLjkzMlxuXG5cblx0XHQjIHJlc2V0cyB0aGUgYW5pbWF0aW9uIG9uIFN0b3Bcblx0XHRALm9uIEV2ZW50cy5TdGF0ZURpZFN3aXRjaCwgKGZyb20sIHRvLCBzdGF0ZXMpIC0+XG5cdFx0XHRpZiB0byBpcyBcImhpZGVcIlxuXHRcdFx0XHRmb3IgaSBpbiBbMC4uLkBvcHRpb25zLmRvdENvdW50XVxuXHRcdFx0XHRcdEB2aWV3QXJyYXlbaV0uZGVzdHJveSgpXG5cdFx0XHRcdFx0QGNpcmNsZUFycmF5W2ldLmRlc3Ryb3koKVxuXG5cdFx0XHRcdEBjaXJjbGVBcnJheSA9IFtdXG5cdFx0XHRcdEB2aWV3QXJyYXkgPSBbXVxuXG5cdFx0XHRcdCMgUmVzZXRcblx0XHRcdFx0QC5yb3RhdGlvbiA9IDBcblx0XHRcdFx0Y29udGFpbmVyQW5pbWF0aW9uLnN0b3AoKVxuXG5cdFx0QC5vbiBFdmVudHMuU3RhdGVXaWxsU3dpdGNoLCAoZnJvbSwgdG8sIHN0YXRlcykgLT5cblx0XHRcdGlmIHRvIGlzIFwic2hvd1wiXG5cdFx0XHRcdGNvbnRhaW5lckFuaW1hdGlvbi5zdGFydCgpXG5cblx0Y2lyY2xlQW5pbWF0aW9uOiAtPlxuXHRcdGZvciBpIGluIFswLi4uQHZpZXdBcnJheS5sZW5ndGhdXG5cdFx0XHRvZmZzZXQgPSBVdGlscy5yb3VuZChpICogMC4xICsgMC4wNSwgMilcblxuXHRcdFx0QHZpZXdBcnJheVtpXS5hbmltYXRlXG5cdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0cm90YXRpb246IEB2aWV3QXJyYXlbaV0ucm90YXRpb24gKyAxODBcblx0XHRcdFx0ZGVsYXk6IG9mZnNldFxuXHRcdFx0XHR0aW1lOiBAb3B0aW9ucy5kdXJhdGlvbiAvIDQgKyAwLjNcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXG5cdFx0XHRzY2FsZUFuaW1hdGlvbkEgPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRcdGxheWVyOiBAY2lyY2xlQXJyYXlbaV1cblx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRzY2FsZTogMC40NFxuXHRcdFx0XHRkZWxheTogb2Zmc2V0IC8gMlxuXHRcdFx0XHR0aW1lOiBAb3B0aW9ucy5kdXJhdGlvbiAvIDggKyAwLjE1XG5cdFx0XHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblxuXHRcdFx0c2NhbGVBbmltYXRpb25CID0gc2NhbGVBbmltYXRpb25BLnJldmVyc2UoKVxuXG5cdFx0XHRzY2FsZUFuaW1hdGlvbkEub24oRXZlbnRzLkFuaW1hdGlvbkVuZCwgc2NhbGVBbmltYXRpb25CLnN0YXJ0KVxuXHRcdFx0c2NhbGVBbmltYXRpb25BLnN0YXJ0KClcblxuXG5cdHN0YXJ0OiAtPlxuXHRcdHJldHVybiBpZiBpc1NwaW5uaW5nIGlzIHRydWVcblxuXHRcdGlzU3Bpbm5pbmcgPSB0cnVlXG5cblx0XHRpZiBAb3B0aW9ucy5oYXNCYWNrZ3JvdW5kQ29sb3IgaXNudCBcIlwiXG5cdFx0XHRAYmFja2dyb3VuZEFycmF5WzBdLnN0YXRlcy5zd2l0Y2ggXCJzaG93XCJcblxuXHRcdGZvciBpIGluIFswLi4uQG9wdGlvbnMuZG90Q291bnRdXG5cdFx0XHR2ID0gbmV3IExheWVyXG5cdFx0XHRcdGhlaWdodDogQG9wdGlvbnMuZG90U2l6ZVxuXHRcdFx0XHR3aWR0aDogQG9wdGlvbnMuZG90U2l6ZVxuXHRcdFx0XHR4OiAtQG9wdGlvbnMuZG90U2l6ZS8yXG5cdFx0XHRcdHk6IC1Ab3B0aW9ucy5kb3RTaXplLzJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblxuXHRcdFx0QHZpZXdBcnJheS5wdXNoKHYpXG5cblx0XHRcdEAuYWRkQ2hpbGQodilcblxuXHRcdFx0YyA9IG5ldyBMYXllclxuXHRcdFx0XHRoZWlnaHQ6IEBvcHRpb25zLmRvdFNpemVcblx0XHRcdFx0d2lkdGg6IEBvcHRpb25zLmRvdFNpemVcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBAb3B0aW9ucy5kb3RDb2xvclxuXHRcdFx0XHR5OiAtQG9wdGlvbnMubG9hZGVySGVpZ2h0IC8gMlxuXHRcdFx0XHRib3JkZXJSYWRpdXM6IEBvcHRpb25zLmRvdFNpemUgLyAyXG5cblx0XHRcdEBjaXJjbGVBcnJheS5wdXNoKGMpXG5cdFx0XHR2LmFkZENoaWxkKGMpXG5cblx0XHRAY2lyY2xlQW5pbWF0aW9uKClcblx0XHRALnN0YXRlcy5zd2l0Y2ggXCJzaG93XCJcblxuXHRcdHNlbGYgPSBAXG5cdFx0IyBDaGVjayB3aGVuIHRoZSBsYXN0IGFuaW1hdGlvbiBlbmRlZCBhbmQgc3RhcnQgYWdhaW5cblx0XHRAdmlld0FycmF5W0BvcHRpb25zLmRvdENvdW50LTFdLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+XG5cdFx0XHRzZWxmLmNpcmNsZUFuaW1hdGlvbigpXG5cblxuXHRzdG9wOiAtPlxuXHRcdHJldHVybiBpZiBpc1NwaW5uaW5nIGlzIGZhbHNlXG5cdFx0aXNTcGlubmluZyA9IGZhbHNlXG5cblx0XHRALnN0YXRlcy5zd2l0Y2ggXCJoaWRlXCJcblxuXHRcdGlmIEBvcHRpb25zLmhhc0JhY2tncm91bmRDb2xvciBpc250IFwiXCJcblx0XHRcdEBiYWNrZ3JvdW5kQXJyYXlbMF0uc3RhdGVzLnN3aXRjaCBcImhpZGVcIlxuIl19
