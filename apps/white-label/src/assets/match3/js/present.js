"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Present = function Present(x, y, width, height, parent, index) {
  _classCallCheck(this, Present);

  _defineProperty(this, "getNeighbours", function () {
    var arr = []; //top, right, bottom, left

    if (this.pos.y > 0) arr.push(this.parent.presents[this.pos.x + (this.pos.y - 1) * this.parent.columns]);
    if (this.pos.x < this.parent.rows - 1) arr.push(this.parent.presents[this.pos.x + 1 + this.pos.y * this.parent.columns]);
    if (this.pos.y < this.parent.columns - 1) arr.push(this.parent.presents[this.pos.x + (this.pos.y + 1) * this.parent.columns]);
    if (this.pos.x > 0) arr.push(this.parent.presents[this.pos.x - 1 + this.pos.y * this.parent.columns]);
    return arr;
  });

  _defineProperty(this, "getDiagonalNeighbours", function () {
    var arr = []; //topright, bottomright, bottomleft, topleft

    if (this.pos.y > 0 && this.pos.x < this.parent.columns - 1) arr.push(this.parent.presents[this.pos.x + 1 + (this.pos.y - 1) * this.parent.columns]);
    if (this.pos.x < this.parent.columns - 1 && this.pos.y < this.parent.rows - 1) arr.push(this.parent.presents[this.pos.x + 1 + (this.pos.y + 1) * this.parent.columns]);
    if (this.pos.x > 0 && this.pos.y < this.parent.rows - 1) arr.push(this.parent.presents[this.pos.x - 1 + (this.pos.y + 1) * this.parent.columns]);
    if (this.pos.x > 0 && this.pos.y > 0) arr.push(this.parent.presents[this.pos.x - 1 + (this.pos.y - 1) * this.parent.columns]);
    return arr;
  });

  _defineProperty(this, "update", function () {
    this.x = $(this.symbol).position().left / this.parent.scaleFactor;
    this.y = $(this.symbol).position().top / this.parent.scaleFactor;
    this.pos.x = Math.round(this.x / this.width);
    this.pos.y = Math.round(this.y / this.height);
    this.isDrag = false;
    this.parent.presents[this.pos.x + this.pos.y * this.parent.rows] = this;
    this.neighbours = this.getNeighbours();

    var _this = this;

    $(_this.symbol).off('mousedown touchstart mouseup touchend click mouseenter mouseleave touchleave');

    if (this.debug) {
      $(_this.symbol).on('mouseenter', function () {
        _this.neighbours.forEach(function (content) {
          if (content) $(content.debug).css({
            'background-color': 'white'
          });
        });
      });
      $(_this.symbol).on('mouseleave', function () {
        _this.parent.resetDebug();
      });
    }

    $(_this.symbol).on('mousedown touchstart', function (e) {
      if (!_this.parent.startPresent) {
        _this.parent.startPresent = _this;
        _this.isDrag = true;
      } else if (!_this.parent.endPresent) {
        _this.parent.endPresent = _this;
      }

      if (_this.parent.endPresent && _this.parent.startPresent) _this.parent.swapPresent(_this.parent.startPresent, _this.parent.endPresent);
    });
  });

  _defineProperty(this, "activateSuper", function () {
    var _this = this;

    _this.isSuper = true;

    if (!_this.parent.seenSuper) {
      _this.parent.seenSuper = true;
      _this.parent.edgeInstance.getStage().setSeenSuper();
      _this.parent.edgeInstance.getStage().showPopup('super');
    }

    _this.superAnim = document.createElement('div');
    $(_this.superAnim).css({
      position: 'absolute',
      width: '200%',
      height: '200%',
      left: '-50%',
      top: '-50%',
      background: 'url(./images/sparkle.png) 50% 50%',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
      'pointer-events': 'none',
    });
    $(_this.symbol).css({
      'z-index': 100
    });
    $(_this.iconLayer).css({
      filter: 'drop-shadow(0px 0px 10px ' + _this.parent.edgeInstance.getStage().getVariable('secondaryColour') + ')'
    });
    $(_this.symbol).append(_this.superAnim);
    var tl = new TimelineMax().timeScale(0.2);
    tl.fromTo($(_this.superAnim), 1, {
      rotation: 0
    }, {
      rotation: 360,
      repeat: -1,
      ease: Linear.easeNone
    }, 0);
    tl.fromTo($(_this.superAnim), 0.2, {
      scale: 2
    }, {
      scale: 0.75,
      yoyo: true,
      repeat: -1,
      ease: Linear.easeNone
    }, 0);
  });

  _defineProperty(this, "activateUltimate", function () {
    var _this = this;

    _this.isUltimate = true;

    if (!_this.parent.seenUltimate) {
      _this.parent.seenUltimate = true;  
      _this.parent.edgeInstance.getStage().showPopup('ultimate');
      _this.parent.edgeInstance.getStage().setSeenUltimate();
    }

    _this.ultimateAnim = document.createElement('div');
    $(_this.ultimateAnim).css({
      position: 'absolute',
      width: '200%',
      height: '200%',
      left: '-50%',
      top: '-50%',
      background: 'url(./images/sparkleBlue.png) 50% 50%',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
      'pointer-events':'none',
    });
    $(_this.symbol).css({
      'z-index': 100
    });
    $(_this.iconLayer).css({
      background: 'url(./images/ultimateIcon.png) 50% 50%',
      'background-repeat': 'no-repeat',
      'background-size': 'contain',
    });
    _this.icon = 'ultimateIcon.png';
    $(_this.symbol).append(_this.ultimateAnim);
    var tl = new TimelineMax().timeScale(0.2);
    tl.fromTo($(_this.iconLayer), 0.1, {
      scale: 0
    }, {
      scale: 1.1
    });
    tl.fromTo($(_this.iconLayer), 5, {
      rotation: 0
    }, {
      rotation: -360,
      repeat: -1,
      ease: Linear.easeNone
    }, 0);
    tl.fromTo($(_this.ultimateAnim), 1, {
      rotation: 0
    }, {
      rotation: 360,
      repeat: -1,
      ease: Linear.easeNone
    }, 0);
    tl.fromTo($(_this.ultimateAnim), 0.2, {
      scale: 1
    }, {
      scale: 0.5,
      yoyo: true,
      repeat: -1,
      ease: Linear.easeNone
    }, 0);
  });

  this.debug = false; //this.debug = true;

  this.x = x;
  this.y = y;
  this.destination = {
    x: x,
    y: y
  };
  this.width = width;
  this.height = height;
  this.parent = parent;
  this.processed = false;
  this.verticalMatch = null;
  this.horizontalMatch = null;
  var options = [['#60C48E', 'cap_Red.png', 1], ['#CD6EA2', 'cap_Pink.png', 2], ['#5BE2D9', 'cap_Green.png', 3], ['#E4C8FC', 'cap_Purple.png', 4], ['#F78390', 'cap_Gold.png', 5], ];
  /*
  var options = [
  ['#60C48E', 'Parcels_01-01.svg', 1],
  ['#CD6EA2', 'Parcels_01-02.svg', 2],
  ['#5BE2D9', 'Parcels_01-03.svg', 3],
  ['#E4C8FC', 'Parcels_01-04.svg', 4],
  ['#F78390', 'Parcels_01-05.svg', 5],
  ['#FAE68C', 'Parcels_01-06.svg', 6],
  ['#000000', 'Parcels_01-07.svg', 7],
  ];*/

  this.attribs = chance.pickone(options);
  this.color = this.attribs[0];
  this.icon = this.attribs[1];
  this.moveTestID = this.attribs[2];
  this.pos = {
    x: 0,
    y: 0
  };
  this.image = document.createElement('div');
  this.isDrag = false;
  this.neighbours = [];
  this.diagonalNeighbours = [];
  this.isSuper = false;
  this.isUltimate = false;

  if (this.debug) {
    this.debug = document.createElement('div');
    $(this.debug).css({
      position: 'absolute',
      width: '15%',
      height: '15%',
      left: '50%',
      top: '50%',
      'border-radius': '50%',
      background: 'black',
      transform: 'translate(-50%, -50%)',
    });
  }

  $(this.image).css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    'z-index': 100,
  });

  if (this.debug) {
    $(this.image).css({
      background: this.color,
      'border-radius': '50%',
    });
  }

  this.highlight = document.createElement('div');
  $(this.highlight).css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: '30%',
    top: '-30%',
    background: 'white',
    'border-radius': '50%',
    opacity: 0.3,
  });
  this.iconLayer = document.createElement('div');
  $(this.iconLayer).css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    background: 'url(./images/' + this.icon + ') 50% 50%',
    'background-repeat': 'no-repeat',
    'background-size': 'contain'
  });
  this.symbol = document.createElement('div');
  $(this.symbol).css({
    position: 'absolute',
    left: this.x,
    top: this.y,
    width: this.width,
    height: this.height,
    cursor: 'pointer',
    opacity: 1,
    'z-index': 10
  });

this.flash = document.createElement('div');
$(this.flash).css({
  position: 'absolute',
  width: '50%', height: '100%',
  left: '50%', top: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  background: 'linear-gradient(to right, transparent, white, transparent)',
  'z-index': 100,
  opacity: 0.4,
});
$(this.iconLayer).append($(this.flash));
//var tl = new TimelineMax({delay: 5, repeat: -1, repeatDelay: 12});
//tl.fromTo($(this.flash), 1.5, {rotation: -45, scaleY: 0.3, opacity: 0}, {rotation: -45, scaleY: 1, yoyo: true, repeat: 1, opacity: 0.4});
//tl.fromTo($(this.flash), 3, {x: '-140%', y: '0%'}, {x: '-50%', y: '-50%', ease: Linear.easeNone}, 0);
//tl.to($(this.flash), 3, {x: '20%', y: '-90%', ease: Linear.easeNone}, 0);

  $(parent.symbol).append(this.symbol);
  $(this.symbol).append(this.image);
  $(this.image).append(this.iconLayer); //$(this.image).append(this.highlight);

  if (this.debug) {
    $(this.symbol).append(this.debug); //debug loop

    var _this2 = this;

    setInterval(function () {
      _this2.image.innerHTML = _this2.pos.x + ',' + _this2.pos.y + '<br>' + _this2.isDrag + '<br>' + (_this2.pos.x + _this2.pos.y * _this2.parent.columns);
    }, 17);
  }
};