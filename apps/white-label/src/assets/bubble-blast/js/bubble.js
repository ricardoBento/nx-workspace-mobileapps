"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Bubble = function Bubble(x, y, radius, colour, parent) {
  _classCallCheck(this, Bubble);

  _defineProperty(this, "snapTo", function (pos) {

    if(!pos || pos.x < 0 || pos.x > 1282.5)
    {
      $(this.symbol).remove();
      this.parent.spawnBall();
    }

  	this.parent.currBall = null;
    $(this.symbol).css({
      left: pos.x,
      top: pos.y
    });
    this.x = pos.x;
    this.y = pos.y;    
    this.update(true);
    this.parent.checkMatches(this, true, true, null);
  });

  _defineProperty(this, "update", function (insertToArray, whichArray) {
    this.pos.y = Math.round($(this.symbol).position().top / this.parent.scaleFactor / ($(this.symbol).height() - this.parent.heightOffset));
    if (this.pos.y % 2 == 0) this.pos.x = Math.round($(this.symbol).position().left / this.parent.scaleFactor / $(this.symbol).width());else this.pos.x = Math.round(($(this.symbol).position().left / this.parent.scaleFactor - $(this.symbol).width() / 2) / $(this.symbol).width());
    this.centerPoint = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.index = this.pos.x + this.pos.y * this.parent.cols;
    this.y = this.pos.y * (this.height - this.parent.heightOffset);
    this.x = this.pos.x * this.width;
    if (this.pos.y % 2) this.x += this.width / 2;

    if (insertToArray) {
      if (whichArray) whichArray[this.index] = this;else this.parent.bubbles[this.index] = this;
    }

    $(this.center).css({
      left: this.centerPoint.x,
      top: this.centerPoint.y
    });
    if (this.debug) this.debug.innerHTML = this.pos.x + ',' + this.pos.y + '<br>' + this.index + '<br>';
  });

  _defineProperty(this, "getNeighbours", function (returnAvailableSpots) {
    var _this = this;

    var neighbours = [];
    var potentials = [];
    var offsets;
    if (this.pos.y % 2) offsets = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 0]];else offsets = [[-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];
    var centers = [[-(.5 * _this.width), -(_this.height - _this.parent.heightOffset)], [.5 * _this.width, -(_this.height - _this.parent.heightOffset)], [_this.width, 0], [.5 * _this.width, _this.height - _this.parent.heightOffset], [-(.5 * _this.width), _this.height - _this.parent.heightOffset], [-_this.width, 0]];
    offsets.forEach(function (content, index) {
      var xToCheck = _this.pos.x + content[0];
      var yToCheck = _this.pos.y + content[1];

      if (yToCheck >= 0 && xToCheck >= 0 && xToCheck < _this.parent.cols) {
        if (_this.parent.bubbles[xToCheck + yToCheck * _this.parent.cols]) {
          neighbours.push(_this.parent.bubbles[xToCheck + yToCheck * _this.parent.cols]);
        } else {
          //work out the centre point of the available space
          var centerX = _this.x + centers[index][0];
          var centerY = _this.y + centers[index][1];
          potentials.push({
            x: centerX,
            y: centerY
          });
        }
      }
    });
    if (returnAvailableSpots) return potentials;else return neighbours;
  });

  this.debug = false;
  //this.debug = true;

  this.x = x;
  this.y = y;
  this.width = radius;
  this.height = radius;
  this.colour = colour;
  this.parent = parent;
  this.processed = false;
  this.centerPoint = {
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  };
  this.pos = {
    x: 0,
    y: 0
  };
  this.index = this.pos.x + this.pos.y + this.parent.cols;
  this.symbol = document.createElement('div');
  $(this.symbol).css({
    position: 'absolute',
    left: this.x,
    top: this.y,
    width: this.width,
    height: this.height,
    'border-radius': '50%',
    background: this.colour,
    overflow: 'hidden',
    'z-index': 10
  });
  $(this.parent.symbol).append(this.symbol);
  this.highlight = document.createElement('div');
  $(this.highlight).css({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    background: 'white',
    transform: 'translate(30%, -30%)',
    'border-radius': '50%',
    opacity: 0.2
  });
  $(this.symbol).append(this.highlight);

  if (this.debug) {
    this.debug = document.createElement('p');
    this.debug.innerHTML = this.pos.x + ',' + this.pos.y;
    $(this.debug).css({
      position: 'absolute',
      left: '50%',
      top: '50%',
      'text-align': 'center',
      width: '100%',
      height: '100%',
      'font-size': '32px',
      transform: 'translate(-50%, -50%)',
      margin: 0,
      padding: 0
    });
    $(this.symbol).append(this.debug);
  }
};