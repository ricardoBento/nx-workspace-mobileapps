"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BlastField = function BlastField(_x, _y, cols, rows) {
  _classCallCheck(this, BlastField);

  _defineProperty(this, "startLevel", function () {
    for (var y = 0; y < 3; y++) {
      var startPos = 0;
      y % 2 == 0 ? startPos = 0 : startPos = this.P_WIDTH / 2;

      for (var x = 0; x < this.cols; x++) {
        var tmp = new Bubble(+startPos + x * this.P_WIDTH, y * (this.P_HEIGHT - this.heightOffset), this.P_WIDTH, chance.pickone(this.colours), this);
        this.bubbles[x + y * this.cols] = tmp;
      }
    }
    this.updateChildren();
    this.startLevelTimer();
  });

  _defineProperty(this, "startLevelTimer", function () {
    var _this = this;

    _this.levelTimerInt = setTimeout(function () {
      _this.canAddLayer = true;  
    }, _this.levelTimer * 1000);
  });

  _defineProperty(this, "addNewLayer", function () {
    var _this = this;

    var tmp = new Array(_this.bubbles.length);

    _this.bubbles.forEach(function (content, index) {
      if (content) {
        $(content.symbol).css({
          top: content.y + (content.height - _this.heightOffset) * 2
        });
        content.update(true, tmp);
      }
    });

    _this.bubbles = tmp;

    for (var y = 0; y < 2; y++) {
      var startPos = 0;
      y % 2 == 0 ? startPos = 0 : startPos = this.P_WIDTH / 2;

      for (var x = 0; x < this.cols; x++) {
        var colour;
        if (_this.coloursOnStage.length > 0) 
        	colour = chance.pickone(_this.coloursOnStage);
        else 
        	colour = chance.pickone(_this.colours);

        var tmp = new Bubble(+startPos + x * this.P_WIDTH, y * (this.P_HEIGHT - this.heightOffset), this.P_WIDTH, colour, this);
        this.bubbles[x + y * this.cols] = tmp;
        tmp.update(true);
      }
    } //check highest row
    _this.checkHighestRow();
  });

  _defineProperty(this, "spawnBall", function () {
    var _this = this;

    $(_this.svgLayer).css({
      opacity: 0
    });

    this.touchStartPoint = null;
    this.touchEndPoint = null;
    this.validMove = false;

    this.coloursOnStage = [];
    this.bubbles.forEach(function (content, index) {
      if (content) _this.coloursOnStage.push(content.colour);
    });
    
    this.currBall = new Bubble(this.width / 2 - this.P_WIDTH / 2, this.height + this.heightOffset * 4, this.P_WIDTH, this.nextColour, this);
    this.currBall.isFired = false;

    if(_this.coloursOnStage.length > 0)
    	this.nextColour = chance.pickone(this.coloursOnStage);
    else
    	this.nextColour = chance.pickone(this.colours);

    if(this.canAddLayer)
    {
      this.addNewLayer();
      this.canAddLayer = false;
      this.startLevelTimer();
    }

    AdobeEdge.compositions[Object.keys(AdobeEdge.compositions)].getStage().updatePreviewPanel(this.nextColour);
    //this.updateFirstLine();
  });

  _defineProperty(this, "updateFirstLine", function () {
    var ballX = this.currBall.x + this.P_WIDTH / 2 + this.x;
    var ballY = this.currBall.y + this.P_HEIGHT / 2 + this.y;
    this.firstLine.setAttribute('x1', ballX);
    this.firstLine.setAttribute('y1', ballY);   
        
    if (this.direction) {
      var magnitude = Math.sqrt(Math.pow(this.direction.x, 2) + Math.pow(this.direction.y, 2));
      var tmpDir = {x: this.direction.x/magnitude, y: this.direction.y/magnitude};
      tmpDir.x *= 300;
      tmpDir.y *= 300;
      tmpDir.x += ballX;
      tmpDir.y += ballY;
      this.slope = (ballY - this.direction.y) / (ballX - this.direction.x);      
      this.firstLine.setAttribute('x2', tmpDir.x);
      this.firstLine.setAttribute('y2', tmpDir.y);

      if(tmpDir.y <= 2066)
      {
      	this.validMove = true;
      	$(this.svgLayer).css({opacity: 1});
      }
      else
      {
      	this.validMove = false;
      	$(this.svgLayer).css({opacity: 0});
      }
    } 
  });

  _defineProperty(this, "findNextPoints", function (startPointX, startPointY, endPoints) {
    if (this.contactPoints.length < 4) {
      var b = startPointY - this.slope * startPointX;
      var y = this.slope * endPoints[this.contactPoints.length % 2] + b;
      var x = endPoints[this.contactPoints.length % 2];
      this.contactPoints.push({
        x: x,
        y: y
      });
      this.slope = -this.slope;
      this.findNextPoints(x, y, endPoints);
    } else {
      return;
    }
  });

  _defineProperty(this, "fireBubble", function () {    
      var _this = this;

      var mag = Math.sqrt(Math.pow(_this.direction.x, 2) + Math.pow(_this.direction.y, 2));
      var normalised = {x: _this.direction.x/mag, y: _this.direction.y/mag};    
      _this.direction = normalised;

      if(this.validMove)  
      {    
        this.currBall.isFired = true;
        this.currFPSTimer = new Date().getTime();
        this.lastFPSTimer = this.currFPSTimer;
        this.deltaTime = 0;
        requestAnimationFrame(function(){_this.moveBall()}); 
      }   
  });

  _defineProperty(this, "moveBall", function () {
    var speed = 15;
    var _this = this;

    _this.currFPSTimer = new Date().getTime();
    
    $(_this.currBall.symbol).css({
      left: ($(_this.currBall.symbol).position().left + (_this.direction.x)*speed)/_this.scaleFactor,
      top: ($(_this.currBall.symbol).position().top + (_this.direction.y)*speed)/_this.scaleFactor,
    });

    if(($(_this.currBall.symbol).position().left/_this.scaleFactor) <= -40)
    {
      _this.direction.x *= -1;
    }

    if(($(_this.currBall.symbol).position().left/_this.scaleFactor) >= 1280)  
    {
      _this.direction.x *= -1; 
    }           

      _this.deltaTime = _this.currFPSTimer - _this.lastFPSTimer;
      _this.lastFPSTimer = _this.currFPSTimer;

      _this.checkHit();  
  });

  _defineProperty(this, "checkHit", function () {
    var _this = this;

    if($(_this.currBall.symbol).position().top <= 0)
    {
    	var x = ($(_this.currBall.symbol).position().left / _this.scaleFactor) - $(_this.symbol).position().left;
    	x = Math.round(x/_this.P_WIDTH)*_this.P_WIDTH;
      if(x >= 1215)
        x = 1215;
      if(x <= 0)
        x = 0;

    	_this.currBall.snapTo({x: x, y: 0});
         return;
    }
    var contactBubble;
    for (var i = 0; i < this.bubbles.length; i++) {
      if (this.bubbles[i]) {
        contactBubble = this.bubbles[i];
        this.currBall.centerPoint = {
          x: $(this.currBall.symbol).position().left / this.scaleFactor + $(this.currBall.symbol).width() / 2,
          y: $(this.currBall.symbol).position().top / this.scaleFactor + $(this.currBall.symbol).height() / 2
        };
        var centerToMatch = {
          x: $(this.bubbles[i].symbol).position().left / this.scaleFactor + $(this.bubbles[i].symbol).width() / 2,
          y: $(this.bubbles[i].symbol).position().top / this.scaleFactor + $(this.bubbles[i].symbol).height() / 2
        };
        var d = Math.sqrt(Math.pow(centerToMatch.x - this.currBall.centerPoint.x, 2) + Math.pow(centerToMatch.y - this.currBall.centerPoint.y, 2));

        if (d <= $(this.currBall.symbol).width()) {
          var closestDistance = Infinity;
          var snapSpot = null;
          this.bubbles[i].getNeighbours(true).forEach(function (content, index) {
            var d = Math.sqrt(Math.pow(content.x - _this.currBall.centerPoint.x, 2) + Math.pow(content.y - _this.currBall.centerPoint.y, 2));

            if (d < closestDistance) {
              closestDistance = d;
              snapSpot = content;
            }
          });

          if(!snapSpot)
          {
            $(this.currBall.symbol).remove();
            this.spawnBall();
            return;
          }

          if(Math.ceil(snapSpot.y/135)%2 != 0)
          {
            if(snapSpot.x <= 67.5)
              snapSpot.x = 67.5;
            if(snapSpot.x >= 1282.5)
              snapSpot.x = 1282.5;
          }
          else
          {
            if(snapSpot.x <= 0)
              snapSpot.x = 0;
            if(snapSpot.x >= 1215)
              snapSpot.x = 1215;
          }
          //console.log({x: x, y: 0});
          _this.currBall.snapTo(snapSpot);
          return;
        }
      }
    }

    if($(_this.currBall.symbol).position().top < 0)
    {
      $(_this.currBall.symbol).remove();
      _this.spawnBall();
      return;
    }

    requestAnimationFrame(function(){_this.moveBall()});
  });

  _defineProperty(this, "updateChildren", function () {
    this.bubbles.forEach(function (content) {
      if (content) content.update();
    });
  });

  _defineProperty(this, "checkHighestRow", function () {      
     var _this = this; 
    var highest = 0;

    _this.bubbles.forEach(function (content, index) {
      if(content)
      {
        if (content.pos.y > highest) {
          highest = content.pos.y;
        }
      }
    });

    if (highest >= 12) 
      _this.gameOver('Game Over!');      
  });

  _defineProperty(this, "resetProcessed", function () {
    this.bubbles.forEach(function (content) {
      if (content) content.processed = false;
    });
  });

  _defineProperty(this, "checkMatches", function (bubble, matchColour, reset, skipremoved) {
    if (reset) this.resetProcessed();
    var toMatch = bubble.colour;
    var toProcess = [bubble];
    bubble.processed = true;
    var foundCluster = [];

    while (toProcess.length > 0) {
      var currBubble = toProcess.pop();

      if (!matchColour || matchColour && currBubble.colour == toMatch) {
        foundCluster.push(currBubble);
        var neighbours = currBubble.getNeighbours();

        for (var i = 0; i < neighbours.length; i++) {
          if (!neighbours[i].processed) {
            toProcess.push(neighbours[i]);
            neighbours[i].processed = true;
          }
        }
      }
    }

    if (matchColour) this.deleteCluster(foundCluster);
    return foundCluster;
  });

  _defineProperty(this, "deleteCluster", function (foundCluster) {
    if (foundCluster.length < 3) {
      this.checkHighestRow();
      this.spawnBall();     
      return;
    }

    var _this = this;

    var tl = new TimelineMax({
      paused: true,
      onComplete: function() {
        _this.checkForFloatingClusters();
      }
    });

    var _this = this;

    foundCluster.forEach(function (content, index) {
      _this.bubbles[content.pos.x + content.pos.y * _this.cols] = null;

      _this.showPoints({
        x: content.x + content.width / 2,
        y: content.y + content.height / 2
      }, _this.scoreValue);

      tl.to($(content.symbol), .1, {
        scale: 0,
        opacity: 0.5,
        onComplete: function(){
          $(content.symbol).remove();
        }
      }, 0);
    });
    tl.play();
  });

  _defineProperty(this, "showPoints", function (pos, val) {
    var tmp = document.createElement('div');
    tmp.innerHTML = '<p class="centeredText">' + val + '</p>';
    $(tmp).css({
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: 100,
      height: 100,
      transform: 'translate(-50%, -50%)',
      opacity: 0
    });
    $(this.symbol).append(tmp);
    TweenMax.to($(tmp), .2, {
      opacity: 1,
      yoyo: true,
      repeat: 1,
      onComplete: function(){
        $(tmp).remove();
      }
    });
    AdobeEdge.compositions[Object.keys(AdobeEdge.compositions)].getStage().updateScorePanel(this.scoreValue);
  });

  _defineProperty(this, "checkForFloatingClusters", function () {
    var _this = this;

    _this.resetProcessed();

    var floatingClusters = [];

    _this.bubbles.forEach(function (content, index) {
      if (content) {
        if (!content.processed) {
          var foundCluster = _this.checkMatches(content, false, false, null);

          if (foundCluster.length > 0) {
            var floating = true;

            for (var i = 0; i < foundCluster.length; i++) {
              if (foundCluster[i].pos.y == 0) {
                floating = false;
                break;
              }
            }

            if (floating) floatingClusters.push(foundCluster);
          }
        }
      }
    });

    if (floatingClusters.length > 0) 
    {
    	_this.clearFloatingClusters(floatingClusters);
    	return true;
    }
    else
    {
    	var numOfBubbles = 0;

        _this.bubbles.forEach(function (content, index) {
          if (content) numOfBubbles++;
        });

        if (numOfBubbles > 0) {
          _this.checkHighestRow();
          _this.spawnBall();
        } else {
          TweenMax.killAll(false, true, true, true);
          AdobeEdge.compositions[Object.keys(AdobeEdge.compositions)].getStage().newLevel();
        }
    }
  });

  _defineProperty(this, "clearFloatingClusters", function (floatingClusters) {
    var _this = this;

    var tl = new TimelineMax({
      paused: true, 
      onComplete: function(){
      	var numOfBubbles = 0;

        _this.bubbles.forEach(function (content, index) {
          if (content) numOfBubbles++;
        });

        if (numOfBubbles > 0) {
          _this.checkHighestRow();
          _this.spawnBall();
        } else {
          TweenMax.killAll(false, true, true, true);
          AdobeEdge.compositions[Object.keys(AdobeEdge.compositions)].getStage().newLevel();
        }
      }     
    });
    floatingClusters.forEach(function (content, index) {
      content.forEach(function (innerContent, innerIndex) {
        _this.bubbles[innerContent.pos.x + innerContent.pos.y * _this.cols] = null;
        tl.to($(innerContent.symbol), .8, {
          top: $(window).height() + 500,
          opacity: 0,
          ease: Sine.easeIn,
          onComplete: function(){
            $(innerContent.symbol).remove();
          }
        }, 0);
      });
    });
    tl.play();
  });

  _defineProperty(this, "gameOver", function (reason) {
    clearTimeout(this.levelTimerInt);
    TweenMax.killAll(false, true, true, true);
    AdobeEdge.compositions[Object.keys(AdobeEdge.compositions)].getStage().gameOver(reason);
  });

  this.x = _x;
  this.y = _y;
  this.cols = cols;
  this.rows = rows;
  this.bubbles = new Array(this.rows * this.cols);
  this.colours = ['#ef7a7c', '#f8a255', '#33cccc', '#6f6ff7', '#eda4ef'];
  this.coloursOnStage = [];
  this.P_WIDTH = 135;
  this.P_HEIGHT = 135;
  this.heightOffset = 15;
  this.currBall;
  this.firstLine;
  this.secondLine;
  this.thirdLine;
  this.fourthLine;
  this.trackingBall;
  this.validMove = false;
  this.touchStartPoint;
  this.touchEndPoint;
  this.direction;
  this.slope;
  this.levelTimer = 30;
  this.levelTimerInt = null;
  this.timer = 0;
  this.scoreValue = 10;
  this.canAddLayer = false;
  this.currFPSTimer;
  this.lastFPSTimer;
  this.deltaTime = 17;
  this.animationFrame;
  this.nextColour = chance.pickone(this.colours);
  this.contactPoints = [];
  this.width = this.cols * this.P_WIDTH + this.P_WIDTH / 2;
  this.height = this.rows * (this.P_HEIGHT - this.heightOffset);
  this.symbol = document.createElement('div');
  $(this.symbol).css({
    position: 'absolute',
    left: this.x,
    top: this.y,
    width: this.width,
    height: this.height
  });
  $('#Stage').append(this.symbol); //draw svg for tracking line

  this.svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.svgLayer.setAttribute('width', $('#Stage').width());
  this.svgLayer.setAttribute('height', $('#Stage').height());
  $(this.svgLayer).css({
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0
  });
  $('#Stage').append(this.svgLayer);
  this.firstLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  this.firstLine.setAttribute('x1', 0);
  this.firstLine.setAttribute('y1', 0);
  this.firstLine.setAttribute('x2', 0);
  this.firstLine.setAttribute('y2', 0);
  this.firstLine.setAttribute('class', 'aimingLine');
  $(this.svgLayer).append(this.firstLine);
  this.scaleFactor = $(window).width() / parseFloat(this.svgLayer.getAttribute('width'));
  /*
  	this.secondLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  	this.secondLine.setAttribute('x1', 0);
  	this.secondLine.setAttribute('y1', 0);
  	this.secondLine.setAttribute('x2', 0);
  	this.secondLine.setAttribute('y2', 0);
  	this.secondLine.setAttribute('class', 'aimingLine');
  	$(this.svgLayer).append(this.secondLine);
  		this.thirdLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  	this.thirdLine.setAttribute('x1', 0);
  	this.thirdLine.setAttribute('y1', 0);
  	this.thirdLine.setAttribute('x2', 0);
  	this.thirdLine.setAttribute('y2', 0);
  	this.thirdLine.setAttribute('class', 'aimingLine');
  	$(this.svgLayer).append(this.thirdLine);
  		this.fourthLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  	this.fourthLine.setAttribute('x1', 0);
  	this.fourthLine.setAttribute('y1', 0);
  	this.fourthLine.setAttribute('x2', 0);
  	this.fourthLine.setAttribute('y2', 0);
  	this.fourthLine.setAttribute('class', 'aimingLine');
  	$(this.svgLayer).append(this.fourthLine);
  		this.trackingBall = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  	this.trackingBall.setAttribute('cx', 100);
  	this.trackingBall.setAttribute('cy', 100);
  	this.trackingBall.setAttribute('r', 50);
  	this.trackingBall.setAttribute('style', 'fill: red;');
  	$(this.svgLayer).append(this.trackingBall);
  */

  $('.aimingLine').css({
    stroke: 'white',
    'stroke-width': 10,
    'stroke-linecap': 'round'
  }); //set up controls

  var _this2 = this;

  $(window).css({'touch-action':'none'});
  $(window).off('mouseup mousedown touchstart touchend');
  $(window).on('mousedown touchstart', function (e) {  	
  	e.preventDefault();
  	if(_this2.currBall.isFired)
  		return;
    _this2.touchStartPoint = {
      x: e.clientX,
      y: e.clientY
    };
    if (e.changedTouches) _this2.touchStartPoint = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };
  });
  $(window).on('mousemove touchmove', function (e) {
  	e.preventDefault();  	
    if (!_this2.touchStartPoint) return;
    if(_this2.currBall.isFired)
  		return;
    $(_this2.svgLayer).css({
      opacity: 1
    });
    _this2.touchEndPoint = {
      x: e.clientX,
      y: e.clientY
    };
    if (e.changedTouches) _this2.touchEndPoint = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    }; //work out direction

    _this2.direction = {
      x: _this2.touchStartPoint.x / _this2.scaleFactor - _this2.touchEndPoint.x / _this2.scaleFactor,
      y: _this2.touchStartPoint.y / _this2.scaleFactor - _this2.touchEndPoint.y / _this2.scaleFactor
    };
	
   _this2.updateFirstLine();
  });
  $(window).on('mouseup touchend', function (e) {
  	 $(_this2.svgLayer).css({
      opacity: 0
    });
  	if(_this2.currBall.isFired)
  		return;
    _this2.fireBubble()
  	e.preventDefault(); 	
    _this2.touchStartPoint = null;
    _this2.touchEndPoint = null;
    $(_this2.svgLayer).css({
      opacity: 0
    });  
  });
  this.startLevel();
};