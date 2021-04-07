"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SwapGrid = function SwapGrid(rows, columns) {
  _classCallCheck(this, SwapGrid);

  _defineProperty(this, "newLevel", function () {
    var _this = this;

    _this.presents = [];
    _this.nextMove = null;
    _this.automate = false;

    do {
      _this.presents.forEach(function (content) {
        $(content.symbol).remove();
      });

      _this.presents = [];

      for (var y = 0; y < _this.rows; y++) {
        for (var x = 0; x < _this.columns; x++) {
          var tmp = new Present((this.P_WIDTH * x), (this.P_HEIGHT * y), this.P_WIDTH, this.P_HEIGHT, _this, x + y * _this.columns); 
          _this.presents.push(tmp);
        }
      }

      _this.presents.forEach(function (content) {
          content.update();
      });
    } while (!_this.checkMatch(null, null, true));
    
    var animArr = [];

    _this.presents.forEach(function (content) {
      animArr.push($(content.image));
    });

    var tl = new TimelineMax({
      onComplete: function() {
        $('#cover').hide();
        _this.checkForPossibleMatches();

        if(_this.nextMove && _this.automate)
          _this.swapPresent(_this.nextMove[0], _this.nextMove[1]);

        _this.edgeInstance.getStage().startHelpTimer();
        _this.edgeInstance.getStage().timerStart(); 
        //_this.clearBoard(_this.presents[27], _this.presents[28]);
      }
    });
    tl.staggerFromTo(animArr.reverse(), 0.6, {
      y:-$('.center-wrapper').height(),
      opacity: 1
    }, {
      y: 0,
      opacity: 1,
      ease: Elastic.easeOut.config(0.8, 1)
    }, 0.05);
  });

  _defineProperty(this, "swapPresent", function (startPresent, endPresent) {
    $('#cover').show();

    var _this = this;

    _this.startPresent = null;
    _this.endPresent = null;
    var tl = new TimelineMax({
      onComplete: function() {
        startPresent.update();
        endPresent.update();

        if (startPresent.isUltimate && endPresent.isUltimate) {
          _this.clearBoard(startPresent, endPresent);

          return;
        }

        if (startPresent.isUltimate) {
          _this.detonateUltimate(startPresent, endPresent);

          return;
        }

        if (endPresent.isUltimate) {
          _this.detonateUltimate(endPresent, startPresent);

          return;
        }

        _this.updateChildren();

        if (!_this.checkMatch(startPresent, endPresent)) {
          tl.reverse();
        }
      },
      onReverseComplete: function() {
        startPresent.update();
        endPresent.update();

        _this.updateChildren();
      }
    });
    tl.to($(startPresent.symbol), 0.3, {
      left: endPresent.x,
      top: endPresent.y
    });
    tl.to($(endPresent.symbol), 0.3, {
      left: startPresent.x,
      top: startPresent.y
    }, 0);
  });

  _defineProperty(this, "updateChildren", function () {
    for (var i = 0; i < this.presents.length; i++) {
      if (this.presents[i]) {
        this.presents[i].update();
      }
    }
  });

  _defineProperty(this, "updateArrayPositions", function () {
    for (var i = 0; i < this.presents.length; i++) {
      this.presents[this.presents[i].pos.x + this.presents[i].pos.y * this.rows] = this.presents[i];
    }
  });

  _defineProperty(this, "reset", function () {
    var _this = this;

    _this.presents.forEach(function (content) {
      if (content) content.isDrag = false;
    });

    _this.startPresent = null;
    _this.endPresent = null;
  });

  _defineProperty(this, "resetProcessed", function () {
    this.presents.forEach(function (content) {
      if (content) content.processed = false;
    });
  });

  _defineProperty(this, "resetDebug", function () {
    this.presents.forEach(function (content) {
      if (content) $(content.debug).css({
        background: 'black'
      });
    });
  });

  _defineProperty(this, "checkMatch", function (present1, present2, gameStart) {
    if (this.stopAll) return;
    $('#cover').show();
    var currMatches = [];

    var _this = this;

    var vert = {
      start: 0,
      end: _this.columns
    };
    var horz = {
      start: 0,
      end: _this.rows
    }; //if present1 and present2 aren't provided then loop through the whole grid

    if (present1 && present2) {
      vert.start = Math.min(present1.pos.x, present2.pos.x);
      vert.end = present1.pos.x == present2.pos.x ? vert.start + 1 : vert.start + 2;
      horz.start = Math.min(present1.pos.y, present2.pos.y);
      horz.end = present1.pos.y == present2.pos.y ? horz.start + 1 : horz.start + 2;
    } 

    //loop through and set all presents matches to null in the appropriate rows/columns
    for (var x = vert.start; x < vert.end; x++) {
      for (var y = 0; y < _this.rows; y++) {
        if (_this.presents[x + y * _this.columns]) _this.presents[x + y * _this.columns].verticalMatch = null;
      }
    }

    for (var y = horz.start; y < horz.end; y++) {
      for (var x = 0; x < _this.columns; x++) {
        if (_this.presents[x + y * _this.columns]) _this.presents[x + y * _this.columns].horizontalMatch = null;
      }
    } 

    //check horizontally
    for (var y = horz.start; y < horz.end; y++) {
      var icon = _this.presents[0 + y * _this.columns].icon;
      var counter = 1;

      for (var x = 1; x < _this.columns; x++) {
        if (icon == _this.presents[x + y * _this.columns].icon) counter++;else {
          _this.addMatch(x, y, counter, 'horizontal', currMatches);

          icon = _this.presents[x + y * _this.columns].icon;
          counter = 1;
        }
      }

      _this.addMatch(x, y, counter, 'horizontal', currMatches, currMatches);
    } 

    //check vertically
    for (var x = vert.start; x < vert.end; x++) {
      var icon = _this.presents[x + 0 * _this.columns].icon;
      var counter = 1;

      for (var y = 1; y < _this.rows; y++) {
        if (icon == _this.presents[x + y * _this.columns].icon) counter++;else {
          _this.addMatch(x, y, counter, 'vertical', currMatches);

          icon = _this.presents[x + y * _this.columns].icon;
          counter = 1;
        }
      }

      _this.addMatch(x, y, counter, 'vertical', currMatches);
    }

    if (gameStart) {
      if (currMatches.length <= 0) return true;else return false;
    }

    if (currMatches.length <= 0) {
      $('#cover').hide();
      return false;
    }

    _this.removeMatches(currMatches, present1, present2);

    return true;
  });

  _defineProperty(this, "addMatch", function (x, y, counter, direction, currMatches) {
    var _this = this;

    var match = [];

    if (counter >= 3) {
      for (counter = counter; counter > 0; counter--) {
        if (direction == 'horizontal') match.push(_this.presents[x - counter + y * _this.columns]);else match.push(_this.presents[x + (y - counter) * _this.columns]);
      }

      match.forEach(function (content, index) {
        if (direction == 'horizontal') content.horizontalMatch = match;else if (direction == 'vertical') content.verticalMatch = match;
      });
      currMatches.push(match);
    }
  });

  _defineProperty(this, "removeMatches", function (currMatches, present1, present2) {
    //check if any are compound matches (both vertical and horizontal)	
    var _this = this;

    var compoundHubs = [];
    var normalMatches = [];

    for (var i = 0; i < currMatches.length; i++) {
      var compound = false;

      for (var j = 0; j < currMatches[i].length; j++) {
        if (currMatches[i][j].horizontalMatch && currMatches[i][j].verticalMatch) {
          compound = true;
          break;
        }
      }

      if (compound) {
        var hub = currMatches[i][j];
        if (!_this.searchArray(compoundHubs, hub)) compoundHubs.push(hub);
      } else {
        if (currMatches[i].length >= 4) {
          if (present1 && present2) {
            for (var j = 0; j < currMatches[i].length; j++) {
              if (present1 == currMatches[i][j]) {
                currMatches[i].length < 5 ? currMatches[i][j].activateSuper() : currMatches[i][j].activateUltimate();
                compoundHubs.push(currMatches[i][j]);
                break;
              }

              if (present2 == currMatches[i][j]) {
                currMatches[i].length < 5 ? currMatches[i][j].activateSuper() : currMatches[i][j].activateUltimate();
                compoundHubs.push(currMatches[i][j]);
                break;
              }
            }
          } else {
            var l = currMatches[i].length;
            var index = Math.floor(l / 2);
            currMatches[i].length < 5 ? currMatches[i][index].activateSuper() : currMatches[i][index].activateUltimate();
            compoundHubs.push(currMatches[i][index]);
          }
        } else {
          normalMatches.push(currMatches[i]);
        }
      }
    }

    var tl = new TimelineMax({
      paused: true,
      onComplete: function() {
        _this.repopulateGrid();

        _this.edgeInstance.getStage().playSound('match');
      }
    }); //increment match score

    _this.edgeInstance.getStage().setMatches(normalMatches.length + compoundHubs.length); //deal with normal matches


    normalMatches.forEach(function (content, index) {
      if (present1 && present2) {
        for (var i = 0; i < content.length; i++) {
          if (content[i] == present1) {
            _this.showScore(50, {
              x: content[i].pos.x * _this.P_WIDTH,
              y: content[i].pos.y * _this.P_HEIGHT
            }, 0);

            break;
          }

          if (content[i] == present2) {
            _this.showScore(50, {
              x: content[i].pos.x * _this.P_WIDTH,
              y: content[i].pos.y * _this.P_HEIGHT
            }, 0);

            break;
          }
        }
      } else {
        _this.showScore(50, {
          x: content[1].pos.x * _this.P_WIDTH,
          y: content[1].pos.y * _this.P_HEIGHT
        }, 0);
      }

      content.forEach(function (innerContent, innerIndex) {
        if (innerContent.isSuper) {
          _this.resetProcessed();

          var target = [innerContent];

          do {
            target = _this.detonateSuper(target[0], tl, 0);
          } while (target.length > 0);
        } else {
          tl.to($(innerContent.symbol), .3, {
            scale: 0,
            rotation: 360,
            onComplete: function() {
              _this.presents[innerContent.pos.x + innerContent.pos.y * _this.columns] = null;
              $(innerContent.symbol).remove();
            }
          }, 0);
        }
      });
    }); //deal with compound matches

    compoundHubs.forEach(function (content, index) {
      if (!content.isSuper && !content.isUltimate) content.activateUltimate();
      var posToMoveTo = {
        x: content.x,
        y: content.y
      };

      _this.showScore(100, {
        x: content.pos.x * _this.P_WIDTH,
        y: content.pos.y * _this.P_HEIGHT
      }, 0);

      if (content.horizontalMatch) {
        content.horizontalMatch.forEach(function (horContent, horIndex) {
          if (horContent != content) {
            if (horContent.isSuper) {
              _this.resetProcessed();

              var target = [horContent];

              do {
                target = _this.detonateSuper(target[0], tl, 0);
              } while (target.length > 0);
            } else {
              tl.to($(horContent.symbol), .2, {
                left: posToMoveTo.x,
                top: posToMoveTo.y,
                onComplete: function() {
                  _this.presents[horContent.pos.x + horContent.pos.y * _this.columns] = null;
                  $(horContent.symbol).remove();
                }
              }, 0);
            }
          }
        });
      }

      if (content.verticalMatch) {
        content.verticalMatch.forEach(function (verContent, verIndex) {
          if (verContent != content) {
            if (verContent.isSuper) {
              _this.resetProcessed();

              var target = [verContent];

              do {
                target = _this.detonateSuper(target[0], tl, 0);
              } while (target.length > 0);
            } else {
              tl.to($(verContent.symbol), .2, {
                left: posToMoveTo.x,
                top: posToMoveTo.y,
                onComplete: function() {
                  _this.presents[verContent.pos.x + verContent.pos.y * _this.columns] = null;
                  $(verContent.symbol).remove();
                }
              }, 0);
            }
          }
        });
      }
    });
    tl.play();
  });

  _defineProperty(this, "detonateSuper", function (innerContent, tl, delay) {
    var _this = this;

    _this.edgeInstance.getStage().addSuper();
    _this.edgeInstance.getStage().playSound('explode');

    TweenMax.killTweensOf(innerContent.superAnim);
    var innerTL = new TimelineMax();
    innerTL.to($(innerContent.superAnim), 0.1, {
      scale: 3
    });
    var neighbours = innerContent.neighbours;
    var n = innerContent.getDiagonalNeighbours();

    for (var i = 0; i < n.length; i++) {
      neighbours.push(n[i]);
    }

    var listOfSupers = [];
    neighbours.forEach(function (content, index) {
      //check they aren't already in a match
      if (!content.processed) {
        if (!content.verticalMatch && !content.horizontalMatch && !content.isSuper) {
          innerTL.to($(content.symbol), .2, {
            opacity: 0,
            onComplete: function() {
              _this.presents[content.pos.x + content.pos.y * _this.columns] = null;
              $(content.symbol).remove();
            }
          }, 0);
        }

        if (content.isSuper) {
          listOfSupers.push(content);
        }

        content.processed = true;
      }
    });

    _this.showScore(200, {
      x: innerContent.pos.x * _this.P_WIDTH,
      y: innerContent.pos.y * _this.P_HEIGHT
    }, 0);

    innerTL.to($(innerContent.symbol), .2, {
      opacity: 0,
      onComplete: function() {
        _this.presents[innerContent.pos.x + innerContent.pos.y * _this.columns] = null;
        $(innerContent.symbol).remove();
      }
    }, 0);
    innerContent.processed = true;
    var t = {
      n: 0
    };
    innerTL.to(t, .3, {
      n: 1,
      onUpdate: function() {
        $('#Stage').css({
          left: chance.floating({
            min: -5,
            max: 5
          }),
          top: chance.floating({
            min: -5,
            max: 5
          })
        });
      },
      onComplete: function() {
        $('#Stage').css({
          left: 0,
          top: 0
        });
      }
    }, 0);
    tl.add(innerTL, delay);
    return listOfSupers;
  });

  _defineProperty(this, "detonateUltimate", function (ultimate, toMatch) {
    var _this = this;
    var interval;

    _this.edgeInstance.getStage().addUltimate();

    var tl = new TimelineMax({
      paused: true,
      onComplete: function() {
        _this.repopulateGrid();
        clearInterval(interval);
      }
    }); 
    //create a darken layer
    var darken = document.createElement('div');
    $(darken).css({
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      'z-index': 2997,
      opacity: 0
    });
    //document.body.append(darken);
    tl.to($(darken), .5, {
      opacity: 1
    }); //create an svg layer

    var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    $(tmp).css({
      position: 'absolute',
      width: _this.width,
      height: _this.height,
      'z-index': 2999,
      opacity: 0
    });
    $(_this.symbol).append(tmp);
    $(ultimate.symbol).css({
      'z-index': 3000
    }); //add in necessary filters

    var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'displacementFilter');
    $(tmp).append(filter);
    var turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
    turb.setAttribute('type', 'turbulence');
    turb.setAttribute('baseFrequency', 0.01);
    turb.setAttribute('numOctaves', 1);
    turb.setAttribute('result', 'turbulence');
    $(filter).append(turb);
    var displace = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    displace.setAttribute('in2', 'turbulence');
    displace.setAttribute('in', 'SourceGraphic');
    displace.setAttribute('scale', 10);
    displace.setAttribute('xChannelSelector', 'R');
    displace.setAttribute('yChannelSelector', 'B');
    $(filter).append(displace);
    var val = 0.03;
    var t = 0;
    var turb = document.querySelectorAll('#displacementFilter feTurbulence')[0];
    interval = setInterval(function () {
      var n = Math.pow(Math.sin(t), 2) * val;
      if(!turb)
      	clearInterval(interval);
      else
      {
	      turb.setAttribute('baseFrequency', n);
	      t++;
	  }
    }, 100);
    /*
    <filter id="blurFilter" x="0" y="0">
         <feGaussianBlur in="SourceGraphic" stdDeviation="100" />
       </filter>*/
    //find all matching symbols

    var matches = [];

    _this.presents.forEach(function (content, index) {
      if (content && content.icon == toMatch.icon) matches.push(content);
    });

    var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    $(tmp).append(group); //draw svg lines

    matches.forEach(function (content, index) {
      $(content.symbol).css({
        'z-index': 2998
      });
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      var pos1 = {
        x: ultimate.pos.x * _this.P_WIDTH + _this.P_WIDTH / 2,
        y: ultimate.pos.y * _this.P_HEIGHT + _this.P_HEIGHT / 2
      };
      var pos2 = {
        x: content.pos.x * _this.P_WIDTH + _this.P_WIDTH / 2,
        y: content.pos.y * _this.P_HEIGHT + _this.P_HEIGHT / 2
      };
      line.setAttribute('d', 'M' + pos1.x + ' ' + pos1.y + ' L' + pos2.x + ' ' + pos2.y);
      group.setAttribute('filter', 'url(#displacementFilter)');
      $(line).css({
        stroke: 'white',
        'stroke-width': '4px',
        'stroke-linecap': 'rounds'
      });
      $(group).append(line);
    });
    tl.to($(tmp), .5, {
      opacity: 1
    }, 0);
    var listOfSupers = [];
    matches.forEach(function (content, index) {
      content.processed = true;

      if (!content.isSuper) {
        _this.showScore(20, {
          x: content.pos.x * _this.P_WIDTH,
          y: content.pos.y * _this.P_HEIGHT
        }, 0.5);

        tl.to($(content.symbol), .2, {
          opacity: 0,
          scale: 1.5,
          onComplete: function() {
            _this.presents[content.pos.x + content.pos.y * _this.columns] = null;
            $(content.symbol).remove();
          }
        }, 1);
      } else {
        _this.detonateSuper(content, tl, 0.5);
      }
    });
    tl.to($(darken), 0.5, {
      opacity: 0,
      onComplete: function() {
        $(darken).remove();
      }
    }, 1);
    tl.to($(tmp), 0.5, {
      opacity: 0,
      onComplete: function() {
        $(tmp).remove();
      }
    }, 1);
    tl.to($(ultimate.symbol), 0.5, {
      scale: 0,
      onComplete: function() {
        _this.presents[ultimate.pos.x + ultimate.pos.y * _this.columns] = null;
        $(ultimate.symbol).remove();
      }
    }, 1);
    ultimate.processed = true;
    tl.play();

    _this.edgeInstance.getStage().playSound('freeze');
  });

  _defineProperty(this, "clearBoard", function (present1, present2) {
    var _this = this;

    _this.edgeInstance.getStage().addClear();
    _this.edgeInstance.getStage().playSound('ultimate');

    var midPos = {
      x: (present2.x + present1.x) / 2,
      y: (present2.y + present1.y) / 2
    };

    _this.showScore(1000, {
      x: midPos.x,
      y: midPos.y
    }, 0, true);

    var tl = new TimelineMax({
      paused: true,
      onComplete: function() {
        _this.repopulateGrid();
      }
    }).timeScale(0.2);
    var t = {
      n: 0
    };

    _this.presents.forEach(function (content, index) {
      var locationVector = {
        x: content.x - midPos.x,
        y: content.y - midPos.y
      };
      var magnitude = Math.sqrt(Math.pow(locationVector.x, 2) + Math.pow(locationVector.y, 2));
      var unitVector = {
        x: locationVector.x / 10,
        y: locationVector.y / 10
      };
      var distance = 800 / Math.sqrt(Math.pow(content.x - midPos.x, 2) + Math.pow(content.y - midPos.y, 2));
      tl.to($(content.symbol), 0.3, {
        left: content.x + unitVector.x * distance * 2,
        top: content.y + unitVector.y * distance * 2,
        rotation: 360,
        opacity: 0,
        onComplete: function() {
          _this.presents[content.pos.x + content.pos.y * _this.columns] = null;
          $(content.symbol).remove();
        }
      }, 0);
    });

    tl.to(t, .3, {
      n: 1,
      onUpdate: function() {
        $('#Stage').css({
          left: chance.floating({
            min: -10,
            max: 10
          }),
          top: chance.floating({
            min: -10,
            max: 10
          })
        });
      },
      onComplete: function() {
        $('#Stage').css({
          left: 0,
          top: 0
        });
      }
    }, 0);
    tl.play();
  });

  _defineProperty(this, "cleanArray", function () {
    this.presents = this.presents.splice(0, this.rows * this.columns);
  });

  _defineProperty(this, "searchArray", function (array, item) {
    var isContained = false;
    array.forEach(function (content, index) {
      if (content == item) isContained = true;
    });
    return isContained;
  });

  _defineProperty(this, "repopulateGrid", function () {
    var _this = this;

    var tl = new TimelineMax({
      paused: false,
      onComplete: function() {
        _this.cleanArray();

        _this.updateChildren();

        if(!_this.checkMatch(null, null, false))
        {
          _this.checkForPossibleMatches();

          if(_this.nextMove && _this.automate)
            _this.swapPresent(_this.nextMove[0], _this.nextMove[1]);
        }
      }
    });

    for (var x = 0; x < _this.columns; x++) {
      var spaces = 0;
      var tmpArray = [];

      for (var y = _this.rows - 1; y >= 0; y--) {
        if (!_this.presents[x + y * _this.columns]) {
          spaces++;
        } else {
          tmpArray.push([_this.presents[x + y * _this.columns], spaces]);
        }
      }

      for (var i = 0; i < spaces; i++) {
        var tmp = new Present(x * this.P_WIDTH, -(i + 1) * this.P_HEIGHT, this.P_WIDTH, this.P_WIDTH, _this, x + y * _this.columns);

        _this.presents.push(tmp);

        tmpArray.push([tmp, spaces]);
      }

      tmpArray.forEach(function (content, index) {
        tl.to($(content[0].symbol), 0.3, {
          top: ($(content[0].symbol).position().top/_this.scaleFactor) + _this.P_HEIGHT * content[1],
          onComplete: function() {
            content[0].update();
          }
        }, 0);
      });
    }
  });

  _defineProperty(this, "checkForPossibleMatches", function () {
    var _this = this;
    if (_this.stopAll) return;

    _this.nextMove = null;

    //check horizontally   
    for(var x = 0; x < _this.columns - 1; x++)
    {
      for(var y = 0; y < _this.rows - 1; y++)
      {
        //swap presents
        var present1 = _this.presents[x + y * _this.columns];
        var present2 = _this.presents[(x + 1) + y * _this.columns];

        //swap icons
        var tmp = present1.icon;
        present1.icon = present2.icon;
        present2.icon = tmp;

        var match = !_this.checkMatch(present1, present2, true);        

        //swap icons back
        var tmp = present1.icon;
        present1.icon = present2.icon;
        present2.icon = tmp;

        if(match)
        {
          _this.nextMove = [present1, present2];
          $('#cover').hide();
          return;
        } 
      }       
    }

    //check vertically
    for(var x = 0; x < _this.columns - 1; x++)
    {
      for(var y = 0; y < _this.rows - 1; y++)
      {
        //swap presents
        var present1 = _this.presents[x + y * _this.columns];
        var present2 = _this.presents[x + (y + 1) * _this.columns];

        //swap icons
        var tmp = present1.icon;
        present1.icon = present2.icon;
        present2.icon = tmp;

        var match = !_this.checkMatch(present1, present2, true);        

        //swap icons back
        var tmp = present1.icon;
        present1.icon = present2.icon;
        present2.icon = tmp;

        if(match)
        {
          _this.nextMove = [present1, present2];
          $('#cover').hide();
          return;
        } 
      }       
    }

    if(_this.nextMove == null)
    {
      _this.gameOver();
    }


    /*
    
    var s = '';

    _this.presents.forEach(function (content, index) {
      s += content.moveTestID.toString();
      if ((index + 1) % _this.columns == 0) s += ' ';
    });

    if (!/(\d)(?:.|(?:.|\n){9}|(?:.|\n){6})?\1\1|(\d)\2(?:.|(?:.|\n){9}|(?:.|\n){6})?\2|(\d)(?:.|\n){7}\3(?:.|(?:.|\n){9})\3|(\d)(?:.|(?:.|\n){9})\4(?:.|\n){7}\4|(\d)(?:(?:.|\n){7,9}|(?:.|\n){17})\5(?:.|\n){8}\5|(\d)(?:.|\n){8}\6(?:(?:.|\n){7,9}|(?:.|\n){17})\6/.test(s)) _this.gameOver();
    */
  });

  _defineProperty(this, "gameOver", function () {
    var _this = this;

    if (_this.stopAll) return;

    for (var i = 0; i < _this.presents.length; i++) {
      if (_this.presents[i].isUltimate) {
        $('#cover').hide();
        return;
      }
    }

    $('#cover').show();
    var shake = 2;
    var tl = new TimelineMax({onComplete: function(){
        _this.shufflePresents();
      }})

    _this.presents.forEach(function (content, index) {
      var tmp = {
        n: 0
      };      
      tl.to(tmp, 1, {
        n: 1,
        onUpdate: function() {
          $(content.symbol).css({
            transform: 'translate(' + chance.floating({
              min: -shake,
              max: shake
            }) + 'px, ' + chance.floating({
              min: -shake,
              max: shake
            }) + 'px)'
          });
        },
        onComplete: function() {
          $(content.symbol).css({
            transform: 'none'
          });          
        }
      }, 0);
    });

    _this.edgeInstance.getStage().gameOver('No More Moves', false);
  });

  _defineProperty(this, "shufflePresents", function () {
      var _this = this;

      var tl = new TimelineMax({paused: true, onComplete: function(){
        _this.updateChildren();
        _this.checkForPossibleMatches();
        _this.checkMatch(null, null, false);  
        _this.edgeInstance.getStage().timerStart();          
      }})

      _this.presents.forEach(function(content, index){               
          tl.to($(content.symbol), .3, {            
            left: $(_this.symbol).width()/2 - $(content.symbol).width()/2,
            top: $(_this.symbol).height()/2 - $(content.symbol).height()/2,
          }, 0);
      });
      _this.presents = chance.shuffle(_this.presents);
      
      for(var x = 0; x < _this.columns; x++)
      {
        for(var y = 0; y < _this.rows; y++)
        {
          tl.to($(_this.presents[x + y * _this.columns].symbol), .3, {
            left: x * _this.P_WIDTH,
            top: y * _this.P_HEIGHT,
          }, 0.5);
        }
      }
      tl.play();
  });

  _defineProperty(this, "showScore", function (val, pos, delay, size) {
    var _this = this;

    var className = 'floatingScore';
    if (size) className = 'floatingScore_Large';
    var tmp = document.createElement('div');
    tmp.innerHTML = '<h1 class="centeredText ' + className + '">' + val + '</h1>';
    $(tmp).css({
      position: 'absolute',
      left: pos.x + _this.P_WIDTH / 2 - 50,
      top: pos.y + _this.P_HEIGHT / 2 - 25,
      width: 100,
      height: 50,
      'z-index': 5000
    });
    $(_this.symbol).append(tmp);

    _this.edgeInstance.getStage().styleElements();

    _this.edgeInstance.getStage().addScore(val);

    TweenMax.fromTo($(tmp), .2, {
      scale: 0
    }, {
      scale: 1,
      yoyo: true,
      delay: delay,
      repeat: 1,
      onComplete: function() {
        $(tmp).remove();
      }
    });
  });

  var _this2 = this;

  this.scaleFactor = $('.center-wrapper').width()/720;
  this.edgeInstance = AdobeEdge.compositions[Object.keys(AdobeEdge.compositions)];
  this.rows = rows ? rows : 5;
  this.columns = columns ? columns : this.rows;
  this.presents = new Array(this.rows * this.columns);
  this.gridSquares = [];
  this.P_WIDTH = ($('.center-wrapper').width()/this.columns)/this.scaleFactor; 
  this.P_HEIGHT = this.P_WIDTH;
  this.width = this.P_WIDTH * this.columns;
  this.height = this.P_HEIGHT * this.rows;
  this.stopAll = false;
  this.startPresent = null;
  this.endPresent = null;
  this.symbol = document.createElement('div');
  this.symbol.id = 'grid';  

  $(this.symbol).css({
    position: 'absolute',
    left: 0,
    top: '50%',
    width: this.width,
    height: this.height,
    transform: 'translate(0, -50%)',
  });
  $('#Stage').append(this.symbol);
  var gridColor1 = 'white';
  var gridColor2 = '#E5E5E5';

  for (var _x = 0; _x < _this2.columns; _x++) {
    for (var _y = 0; _y < _this2.rows; _y++) {
      var _tmp = document.createElement('div');

      $(_tmp).css({
        position: 'absolute',
        left: this.P_WIDTH * _x,
        top: this.P_HEIGHT * _y,
        width: this.P_WIDTH,
        height: this.P_HEIGHT,
        background: _y % 2 == 0 ? gridColor1 : gridColor2
      });
      $(_this2.symbol).append(_tmp);
    }

    var col = gridColor1;
    gridColor1 = gridColor2;
    gridColor2 = col;
  }

  var _this2 = this;

  _this2.edgeInstance.getStage().showLevel(_this2);

  TweenMax.fromTo($(_this2.symbol), 1, {
    opacity: 0
  }, {
    opacity: 1
  });
  $('#Stage').on('mouseleave touchleave', function (e) {
    _this2.reset();
    e.preventDefault();
  });

  $('#Stage').on('touchmove', function(e){
  	e.preventDefault();
  })

  $('#Stage').on('mouseup touchend', function (e) { 
    if (_this2.startPresent) {
    	//for mouse events
      var mouse = {
        x: e.originalEvent.clientX,
        y: e.originalEvent.clientY
      };

      //for touch events
      if(e.changedTouches)
      {
      	mouse = {
      		x: e.changedTouches[0].clientX,
      		y: e.changedTouches[0].clientY,
      	}
      }
      
      if (mouse.x <= $(_this2.symbol).position().left || mouse.x >= $(_this2.symbol).position().left + ($(_this2.symbol).width()*_this2.scaleFactor)) {
        _this2.startPresent.isDrag = false;
        _this2.startPresent = null;
      } else {
        //find where we are in relation to the start present
        var direction = {
          x: mouse.x - (($(_this2.startPresent.symbol).position().left + (_this2.P_WIDTH / 2)) + $(_this2.symbol).position().left),
          y: mouse.y - (($(_this2.startPresent.symbol).position().top + (_this2.P_HEIGHT / 2)) + $(_this2.symbol).position().top),
        };        

        if (Math.abs(direction.x) < _this2.P_WIDTH/2 && Math.abs(direction.y) < _this2.P_HEIGHT / 2) {
       		_this2.reset();

          return;
        }       

        if (Math.abs(direction.x) > Math.abs(direction.y)) {
          //move left or right
          var sign = (direction.x < 0) ? -1 : 1;
          _this2.endPresent = _this2.presents[(_this2.startPresent.pos.x + sign) + _this2.startPresent.pos.y * _this2.columns];
          _this2.swapPresent(_this2.startPresent, _this2.endPresent);
        } else if (Math.abs(direction.y) > Math.abs(direction.x)) {
          //move up or down
          var sign = (direction.y < 0) ? -1 : 1;
          _this2.endPresent = _this2.presents[_this2.startPresent.pos.x + (_this2.startPresent.pos.y + sign) * _this2.columns];
          _this2.swapPresent(_this2.startPresent, _this2.endPresent);
        } else {
          //reset
          _this2.reset();
        }
      }
    } 
    e.preventDefault();
  });
};