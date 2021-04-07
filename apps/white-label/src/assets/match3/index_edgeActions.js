/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

   //Edge symbol: 'stage'
   (function(symbolName) {
      
      
      





















      Symbol.bindElementAction(compId, symbolName, "document", "compositionReady", function(sym, e) {
                  //variables          
                  var scaleFactor = 1;
                  
                  //pick a halfway colour between the secondary colour and white
                  var tmpCanvas = document.createElement('canvas');
         			tmpCanvas.setAttribute('width', 100);
         			tmpCanvas.setAttribute('height', 1);
         			var ctx = tmpCanvas.getContext('2d');
         			var gradient = ctx.createLinearGradient(0, 0, 100, 0);
         			// Add two color stops
         			gradient.addColorStop(0, sym.getVariable('secondaryUIColour'));
         			gradient.addColorStop(1, 'white');
         			// Set the fill style and draw a rectangle
         			ctx.fillStyle = gradient;
         			ctx.fillRect(0, 0, 100, 1);
         			var img = ctx.getImageData(0, 0, 100, 1);
         			var data = img.data;
         			var pixels = [];
         			for(var i = 0; i < data.length; i+= 4)				
         				pixels.push({r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3]});				
         			centreCol = 'rgb('+ pixels[50].r +', '+ pixels[50].g +', '+ pixels[50].b +')'; 
         
                  window.addEventListener('message', processMessage);  
         
                  var activePauseButton;
                  var activeScoreBar;
                  var activeScoreOutline;
                  var activeTimerBar; 
                  var activeTimerOutline;
                  var activePauseMenu;
                  var activeGameOverScreen;
                  var grid;
                  var endText;
                  var activePopup;
                  var currLevel = 1;   
         
                  var seenSuper = false;
                  var seenUltimate = false;  
         
                  var helpTimer = 0; 
                  var helpTimerInt;   
         
                  var gamePlayText = {
         				powerUps: {
         				'super': 'You created a super, combine it in a match to clear its surrounding neighbours',
         				'ultimate': 'You created an ultimate, swap it with any of its neighbours to take out all matching colours on the board',
         				},
                  };
         
                  var gamePaused = false;
                  var pauseSettings = {music: false, sounds: false};
                  sym.pauseGame = function(val)
                  {      
                  	timerStop();
         
                  	gamePaused = val; 
                  	if(gamePaused)
                  	{
                  		timerStop();
                  		TweenMax.pauseAll(); 
                  		showPauseMenu();        		
                  	}
                  	else
                  	{
                  		sym.timerStart();
                  		TweenMax.resumeAll(); 
                  		clearPauseMenu();        		
                  	}        	
         			} 
         			sym.getSettings = function()
         			{
         				return pauseSettings;
         			}	
         			sym.setSettings = function(val)
         			{
         				pauseSettings = val;
         			}	
         			sym.getInfo = function()
         			{
         				return {
         				matches: matches, 
         				level: (currLevel - 1), 
         				score: overallScore + score,
         				totalTime: totalTimePlayed + (timeLimit - timer),
         				ultimates: totalUltimates,
         				supers: totalSupers,
         				clears: totalClears,
         				};
         			}	
         			sym.setMatches = function(val)
         			{
         				matches += val;	
         			}	
         
         			sym.addScore = function(val)
         			{
         				updateScorePanel(val);	
         			}	
         
         			sym.setSeenUltimate = function()
         			{
         				seenUltimate = true;
         			}	
         
         			sym.setSeenSuper = function()
         			{
         				seenSuper = true;
         			}									        
         
         			var timeLimit = 180;
         			var targetScore = 2000;
         			var initialTargetScore = targetScore;
                  var score = 0;
                  var overallScore = score;
                  var totalTimePlayed = 0;
                  var timer = timeLimit;
                  var initialTimeLimit = timeLimit;
                  var timeString = ''; 
                  var matches = 0; 
                  var timerInt; 
                  var totalUltimates = 0;
                  var totalSupers = 0;
                  var totalClears = 0; 
         
                  sym.addUltimate = function()
                  {
                  	totalUltimates++;
                  }         
                  sym.addSuper = function()
                  {
                  	totalSupers++;
                  }         
                  sym.addClear = function()
                  {
                  	totalClears++;
                  }
         
                  sym.playSound = function(name)
                  {
                  	/*
                  	var promise = sym.$(name)[0].play();
         				if(promise)				
         					promise.catch(function(){});
         				*/
                  }
         
                  //-- include animate.css
                  yepnope({load: ['css/animate.css', 'css/scrollbar.css', 'css/magic.css'], complete: awake});
         
                  //hides
                  sym.$('cover').show().css({'z-index': 999});
                  sym.$('cover')[0].id = 'cover'; 
         
                  //preload images
                  var img = new Image();
                  img.src = 'images/snowflakeIcon.png';
                  img.src = 'images/sparkleBlue.png';
                  img.src = 'images/sparkle.png';  
         
         			function awake()
         			{
         				createBG();
         				sym.start();
         
         				$('#Stage').mousedown(function(){
         					helpTimer = 0;
         				});
         
         				$('.center-wrapper').css({
         				overflow: 'hidden',
         				transform: 'translate(-50%, 0)'
         				});				
         
         				$('.flow-wrapper').css({
         				position: 'absolute',
         				top: '50%',
         				left: '50%',
         				transform: 'translate(0, -50%)',
         				});	
         			}
         
         			function createBG()
         			{
         				var tmp = document.createElement('div');
         				$(tmp).css({
         					position: 'absolute',
         					left: 0, top: 0,
         					width: '100%', height: '100%',
         					background: 'url(images/BG.jpg) 40% 50% no-repeat',
         					'background-size':'cover',
         				});
         				$(tmp).insertBefore($('.flow-wrapper'));
         			}
         
         			sym.startHelpTimer = function()
         			{
         				helpTimer = 0;
         				helpTimerInt = setInterval(function(){
         				helpTimer++;
         
         				if(helpTimer >= 12) //once the counter gets to 12 seconds, show a hint
         				{
         					if(grid && grid.nextMove)
         					{
         						var dir = {
         						x: grid.nextMove[1].pos.x - grid.nextMove[0].pos.x,
         						y: grid.nextMove[1].pos.y - grid.nextMove[0].pos.y
         						};
         
         						if(dir.x > dir.y)		
         						{					
         							TweenMax.fromTo($(grid.nextMove[0].symbol), .2, {x: 0}, {x: dir.x * 5, yoyo: true, repeat: 3});
         							TweenMax.fromTo($(grid.nextMove[1].symbol), .2, {x: 0}, {x: -dir.x * 5, yoyo: true, repeat: 3});
         						}
         						else
         						{
         							TweenMax.fromTo($(grid.nextMove[0].symbol), .2, {y: 0}, {y: dir.y * 5, yoyo: true, repeat: 3});
         							TweenMax.fromTo($(grid.nextMove[1].symbol), .2, {y: 0}, {y: -dir.y * 5, yoyo: true, repeat: 3});
         						}
         
         					}
         					helpTimer = 0;
         				}
         				}, 1000);
         			}
         
         			function stopHelpTimer()
         			{
         				clearInterval(helpTimerInt);
         			}
         
         			sym.start = function()
         			{
         				grid = new SwapGrid(8);
         
         				showUI();
         				if(pauseSettings.music)
         					sym.playSound('theme');				
         			}
         
         			function showUI()
         			{
         				//create the timer bar under the grid
         				var arr = new Array(2);
         
         				for(var i = 0; i < arr.length; i++)
         				{
         					arr[i] = document.createElement('div');				
         					$(arr[i]).css({
         						position: 'absolute',
         						left: 0, top: '100%',
         						width: '100%', height: '80px',
         						'border-radius':'0 0 50px 50px',
         						'box-sizing':'border-box',
         						border: '10px solid white',
         						background: 'rgba(0, 0, 0, 0.2)',					
         					});
         					$(grid.symbol).append($(arr[i]));				
         				};
         				activeTimerBar = arr[1];
         				activeTimerOutline = arr[0];				
         				activeTimerBar.setAttribute('class', 'meterFill');
         				activeTimerOutline.setAttribute('class', 'meterBG');										
         				updateTimerBar();
         
         				//create the score bar over the grid				
         				for(var i = 0; i < arr.length; i++)
         				{
         					arr[i] = document.createElement('div');				
         					$(arr[i]).css({
         						position: 'absolute',
         						left: 0, top: 0,
         						width: '100%', height: '100px',
         						'border-radius':'50px 50px 0 0',
         						'box-sizing':'border-box',
         						border: '10px solid white',
         						transform: 'translate(0, -100%)',
         						background: 'rgba(0, 0, 0, 0.2)',											
         					});
         					$(grid.symbol).append($(arr[i]));				
         				};
         				activeScoreBar = arr[1];
         				activeScoreOutline = arr[0];				
         				activeScoreBar.setAttribute('class', 'meterFill');
         				activeScoreOutline.setAttribute('class', 'meterBG');
         				updateScorePanel();
         
         				//create the level text
         				var tmp = document.createElement('div');
         				tmp.innerHTML = '<h2 class="centeredText levelTitleText">Level <span class="arialText">'+ currLevel +'</span></h2>';
         				$(tmp).css({
         					position: 'absolute',
         					left: 0, top: '-170px',
         					width: '100%', height: '50px',
         				});
         				$(grid.symbol).append($(tmp));
         				styleElements();
         
         				//create the pause button
         				if(activePauseButton)
         					return;
         
         				var w = '15vw';
         				activePauseButton = document.createElement('div');
         				activePauseButton.innerHTML = '<div class="pauseElement" id="pause_element_left"></div><div class="pauseElement" id="pause_element_right"></div>';
         				$(activePauseButton).css({
         					position: 'absolute',
         					left: '100%', top: 0,
         					width: w, height: w,					
         					background: sym.getVariable('secondaryUIColour'),
         					'border-radius':'50%',
         					transform: 'translate(-120%, 20%)',
         					'z-index': 1,
         				});
         				document.body.append(activePauseButton);
         
         				$(activePauseButton).on('click', function(){
         					var tl = new TimelineMax();
         					tl.to($(activePauseButton), .05, {scaleX: 1.1, scaleY: 0.9});					
         					tl.to($(activePauseButton), .1, {scaleX: 0.9, scaleY: 1.1});					
         					tl.to($(activePauseButton), .05, {scale: 1});	
         					sym.pauseGame(!gamePaused);														
         				});
         				styleElements();
         			}			
         
         			function showPauseMenu()
         			{
         				activePauseButton.innerHTML = '<div class="pauseElement" id="pause_element_left_cross"></div><div class="pauseElement" id="pause_element_right_cross"></div>';
         
         				activePauseMenu = document.createElement('div');				
         				activePauseMenu.innerHTML = '<h1 class="centeredText pauseText">Game Paused</h1>';
         
         				$(activePauseMenu).css({
         					position: 'absolute',
         					left: 0, top: 0,
         					width: '100%', height: '100%',
         					background: 'rgba(0, 0, 0, 0.5)',
         					opacity: 0,
         					'z-index': 0,
         				});
         				document.body.append(activePauseMenu);
         				$(activePauseMenu).animate({opacity: 1}, 500);
         				styleElements();
         			}
         
         			function clearPauseMenu()
         			{
         				activePauseButton.innerHTML = '<div class="pauseElement" id="pause_element_left"></div><div class="pauseElement" id="pause_element_right"></div>';
         
         				$(activePauseMenu).animate({opacity: 0}, 500, function(){
         					$(activePauseMenu).remove();
         				});
         
         				styleElements();
         			}
         
         			function updateScorePanel(val)
         			{			
         				if(!activeScoreBar)
         					return;
         
         				if(val)				
         					score += val;
         
         				var p = score/targetScore;
         
         				if(p >= 1)
         					nextLevel();
         
         				var borderWidth = parseFloat($(activeScoreBar)[0].style['borderWidth']) * 2;				
         				$(activeScoreBar).css({
         					clip: 'rect(0px, '+ ($(activeScoreBar).width() + borderWidth) * p +'px, '+ ($(activeScoreBar).height() + borderWidth) +'px, 0px)',
         				});
         
         				activeScoreBar.innerHTML = '<h2 class="arialText centeredText scoreText">'+ numberWithCommas(score) +'</h2>';
         				activeScoreOutline.innerHTML = '<h2 class="arialText centeredText scoreText">'+ numberWithCommas(score) +'</h2>';
         				styleElements();
         			}	
         
         			sym.timerStart = function()
         			{
         				clearInterval(timerInt);
         				timerInt = setInterval(function(){
         					timer--;
         					if(timer < 5)
         						sym.playSound('beep');
         
         					updateTimerBar();
         					if(timer <= 0)
         						timeUp();
         				}, 1000);
         			}	
         
         			function timerStop()
         			{
         				stopHelpTimer();
         				clearInterval(timerInt);
         			}
         
         			function updateTimerBar()
         			{				
         				if(!activeTimerBar)
         					return;
         
         				var p = timer/timeLimit;
         
         				var borderWidth = parseFloat($(activeTimerBar)[0].style['borderWidth']) * 2;
         
         				$(activeTimerBar).css({
         				clip: 'rect(0px, '+ ($(activeTimerBar).width() + borderWidth) * p +'px, '+ ($(activeTimerBar).height() + borderWidth) +'px, 0px)',
         				});
         
         				timeString = '';
         				var h = padNum(Math.floor(timer/3600) % 60);
         				var m = padNum(Math.floor(timer/60) % 60);
         				var s = padNum(timer % 60); 
         				timeString = m +':'+ s;
         
         				activeTimerBar.innerHTML = '<h2 class="centeredText arialText timerText">'+ timeString +'</h2>';
         				activeTimerOutline.innerHTML = '<h2 class="centeredText arialText timerText">'+ timeString +'</h2>';
         				styleElements();
         			}
         
         			function padNum(num)
         			{
         				var s = num.toString();
         				if(s.length < 2)
         					s = ('0' + s);
         				return s;
         			}
         
         			function nextLevel()
         			{				
         				$('#cover').show();
         				timerStop();				
         				grid.stopAll = true;	
         
         				if(activePopup)
         				{
         					$(activePopup).remove();
         					activePopup = null;
         				}
         
         				TweenMax.to($(grid.symbol), 1, {opacity: 0, onComplete: function(){
         					$(grid.symbol).remove();
         
         					totalTimePlayed += (timeLimit - timer);
         					timer = timeLimit;
         					updateTimerBar();
         
         					if(currLevel > 1)						
         						targetScore += 1000;
         
         					overallScore += score;
         					score = 0;
         					updateScorePanel();
         
         					grid = new SwapGrid(8);
         					grid.seenSuper = seenSuper;
         					grid.seenUltimate = seenUltimate;
         
         					showUI();
         				}});
         			}
         
         			function timeUp()
         			{
         				$('#cover').show();
         				sym.gameOver('Out of Time!', true);
         			}
         
         			sym.showLevel = function(gridElem)
         			{
         				if(currLevel > 1)
         					sym.playSound('jingle');
         				var tmp = document.createElement('div');
         				tmp.innerHTML = '<h5 class="scoreTagline">Get <span class="arialText">'+ numberWithCommas(targetScore) +'</span> points</h5>'
         				$(tmp).css({
         					position: 'absolute',
         					left: 0,
         					top: '50%',
         					width: '100%',
         					height: 'auto',
         					transform: 'translate(0, -70%)',
         					opacity: 0,
         				});
         				$(gridElem.symbol).append($(tmp));
         				styleElements();
         				TweenMax.to($(tmp), 1, {opacity: 1, yoyo: true, repeat: 1, repeatDelay: 0.5, onComplete: function(){
         					$(tmp).remove();
         					gridElem.newLevel();
         					currLevel++;
         				}});
         			}
         
         			sym.gameOver = function(text, isGameFinished)
         			{
         				timerStop();				
         				$('#cover').show();
         				if(endText)
         					$(endText).remove();
         
         				endText = document.createElement('h3');				
         				endText.innerHTML = text;
         				$(endText).css({
         					position: 'absolute',
         					left: '50%', top: '50%',
         					width: 'auto', height: 'auto',
         					transform: 'translate(-50%, -50%)',
         					'text-align':'center',	
         					'z-index': 99,
         					opacity: 0,	
         					background: 'white',
         					'border-radius':'30px',					
         					border: '10px solid ' + sym.getVariable('secondaryUIColour'),	
         					'box-sizing':'border-box',
         					'z-index': 5000,
         				})
         				$(grid.symbol).append(endText);				
         				anim($(endText), 'fadeIn', 0, 1, function(){
         					anim($(endText), 'fadeOut', 2, 1, function(){
         						$(endText).remove();
         						if(isGameFinished)
         						{
         							showGameOverScreen();
         						}
         					});
         				});
         				$(endText).addClass('paddedText');
         				styleElements();				
         			}
         
         			function showGameOverScreen()
         			{
         				if(activePauseButton)
         					$(activePauseButton).remove();
         
         				if(activePauseMenu)
         					$(activePauseMenu).remove();
         
         				TweenMax.killAll(false, true, true, true);
         
         				activeGameOverScreen = document.createElement('div');
         				$(activeGameOverScreen).css({
         					position: 'absolute',
         					left: 0, top: 0,
         					width: '100%', height: '100%',
         					background: 'rgba(0, 0, 0, 0.5)',
         					opacity: 0,
         				});
         				document.body.append(activeGameOverScreen);
         				$(activeGameOverScreen).animate({opacity: 1}, 500);
         
         				//send info
         				var stats = sym.getInfo();				
         				var score_details = {					
         				"score": stats.score,
         				"matches": stats.matches,
         				"level": stats.level,
         				"time": stats.totalTime,
         				"ultimates": stats.ultimates,
         				"supers": stats.supers,
         				"clears": stats.clears,
         				};
         				var s = JSON.stringify({stats: score_details});
         				window.parent.postMessage(s, '*');
         
         				var pauseBox = document.createElement('div');
         				pauseBox.setAttribute('class', 'pauseBox')
         				pauseBox.innerHTML = '<h1 class="gameOverScreen">Game Over</h1><p class="gameOverScreen">You scored <span class="arialText_Light">'+ numberWithCommas(stats.score) +'</span> points!</p>'
         				$(pauseBox).css({
         					position: 'absolute',
         					left: '5%', top: '50%',
         					width: '90%', height: 'auto',
         					background: 'rgba(255, 255, 255, 0.9)',
         					border: '10px solid ' + sym.getVariable('secondaryUIColour'),
         					'border-radius':'50px',
         					'box-sizing':'border-box',
         					transform: 'translate(0, -50%)',
         				});
         				$(activeGameOverScreen).append($(pauseBox));
         
         				var size = 25;
         				var button = document.createElement('div');
         				button.setAttribute('class', 'replayButton');
         				button.setAttribute('id', 'replayButton');
         
         				button.innerHTML = '<h2 class="centeredText">Replay</h2>';
         
         				$(button).css({
         				position: 'relative',
         				left: '50%', top: 0,
         				width: size + '%', height: 0,
         				background: sym.getVariable('secondaryUIColour'),
         				transform: 'translate(-50%, 0)',
         				'border-radius':'50%',
         				});
         				$(pauseBox).append($(button));
         				styleElements();
         
         				$(button).on('click', function(){
         					var tl = new TimelineMax({onComplete: function(){
         						location.reload();
         					}});
         					tl.to($(button), .05, {scaleX: 1.1, scaleY: 0.9})
         					.to($(button), .1, {scaleX: 0.9, scaleY: 1.1})
         					.to($(button), .05, {scale: 1});
         				});
         
         				activeGameOverScreen.setLeaderboardDisplay = function(data){
         					var text = '<p class="gameOverScreen">You are number <span class="arialText_Light">'+ data.position +'</span> on the leaderboard.</p>';
         					$(text).insertBefore($('#replayButton'));
         					window.removeEventListener('message', processMessage);
         					styleElements();
         				};
         			}
         
         			sym.showPopup = function(type)
         			{
         				if(activePopup)
         					$(activePopup).remove();
         
         				var text = gamePlayText.powerUps[type];
         
         				activePopup = document.createElement('div');
         				activePopup.innerHTML = '<h3 class="popupText">'+ text +'</h3>'
         				$(activePopup).css({
         					position: 'absolute',
         					left: '5%', top: '100%',
         					width: '90%', height: 'auto',
         					transform: 'translate(0, -100%)',
         					background: 'rgba(255, 255, 255, 0.8)',
         					'border-radius':'30px',
         					border:'10px solid ' + sym.getVariable('secondaryUIColour'),
         					'text-align':'center',
         					'box-sizing': 'border-box',	
         				});
         				$('#Stage').append(activePopup);
         				TweenMax.from($(activePopup), 1, {top: 5000});
         				TweenMax.to($(activePopup), 1, {top: 5000, delay: 5, onComplete: function(){
         					$(activePopup).remove();
         					activePopup = null;
         				}});								
         			}
         
         			sym.reload = function()
         			{
         				totalUltimates = 0;
         				totalSupers = 0;
         				totalClears = 0;
         				totalTimePlayed = 0;
         				currLevel = 1;
         				score = 0;
         				overallScore = 0;
         				targetScore = initialTargetScore;
         				timeLimit = initialTimeLimit;
         				matches = 0;
         				nextLevel();
         			}
         
         			function processMessage(msg)
         			{						
         				if(!msg.data)					  
         					return;
         
         				var call = JSON.parse(msg.data);
         
         				if(call.action == 'record_position')
         				{	
         					if(activeGameOverScreen)
         						activeGameOverScreen.setLeaderboardDisplay(call);
         				}
         
         				if(call.action == 'close')
         				{
         					var stats = sym.getInfo();				
         					var score_details = {					
         					"score": stats.score,
         					"matches": stats.matches,
         					"level": stats.level,
         					"time": stats.totalTime,
         					"ultimates": stats.ultimates,
         					"supers": stats.supers,
         					"clears": stats.clears,
         					};
         					var s = JSON.stringify({stats: score_details});
         					window.parent.postMessage(s, '*');
         				}
         			}
         
         			sym.styleElements = function()
         			{
         				styleElements();
         			}
                  function styleElements()
                  {
                  	$('*').css({
                     	'user-select':'none',
                     	'line-height': 1,
                     	'font-weight': 400,
                     	margin: 0, padding: 0,
                     });  
         
                     $('h1, h2, h3, h4, h5, h6').css({
                     	'font-size':'50px',
                     	'font-family':'NotoSans-ExtraCondensedBold',
                     	color: sym.getVariable('mainUIColour'),
                     });
         
                     $('.floatingScore').css({
                     	'font-size':'40px',
                     	color: sym.getVariable('darkTextColour'),
                     });
         
                     $('.floatingScore_Large').css({
                     	'font-size':'80px',
                     	color: sym.getVariable('darkTextColour'),
                     });
         
                     $('h2').css({
                     	'font-size':'30px',
                     	color: 'white',
                     	'text-transform':'uppercase',
                     });
         
                     $('h3').css({
                     	'font-size':'36px',
                     	color: sym.getVariable('darkTextColour'),
                     	'text-transform':'uppercase',
                     });
         
                     $('.popupText').css({
         					'font-size':'2em',
         					margin: '1em',
                     });
         
                     $('.statsLabel').css({
                     	'font-size':'30px',
                     });
         
                     $('h4').css({
         					'font-size': '20px',
         					color: sym.getVariable('secondaryUIColour'),
         					'text-transform':'uppercase',
                     });
         
                     $('h5').css({
         					'font-size': '80px',
         					color: sym.getVariable('darkTextColour'),
         					'text-align':'center',
         					'line-height': 0.2,
                     });
         
                     $('.labelText').css({
         					'padding-left': '1em',            
         					'text-align':'left',
                     });
         
                     $('p').css({
         					'font-size':'24px',
         					'font-family':'NotoSans-Regular',
         					color: sym.getVariable('secondaryUIColour'),
                     });
         
                     $('.arialText').css({
         					//'font-family':'Arial Black',
         					//'font-weight':'bolder',
                     }); 
         
                    	$('.arialText_Light').css({
         					//'font-family':'Arial',
                     });  
         
                     $('.scoreText').css({
                     	'font-size':'50px',
                     });            
         
                     $('.timerText').css({
                     	'font-size':'40px',
                     });            
         
                     $('.pauseButtonText').css({
                     	'font-size':'40px',
                     });             
         
                     $('.pauseText').css({
         					'font-size':'6em',
         					color: 'white',
         					'text-transform':'uppercase',
                     }); 
         
                     $('.levelTitleText').css({
                     	'font-size':'4em',
                     	color: sym.getVariable('darkTextColour'),
                     });           
         
                     $('.stats').css({
                     	'font-size':'30px',
                     });
         
                     $('.pauseSymbol').css({
         					'font-size':'36px',
         					'letter-spacing': '2px',
                     }); 
         
                     $('.centeredText').css({
         					position: 'absolute',
         					left: 0, top: '50%',
         					width: '100%', height: 'auto',
         					transform: 'translate(0, -50%)',
         					'text-align':'center',
                     });  
         
                     $('.buttonBase').css({
         					'background-color': sym.getVariable('mainUIColour'),
         					'box-shadow': '2px 2px 5px rgba(0, 0, 0, 0.3)',
                     });   
         
                     $('.colouredBorder').css({
                     	'border-color': sym.getVariable('mainUIColour'),
                     }); 
         
                     $('.highlights, .panelHighlights').css({
         					transform: 'translate(30%, -30%)',
         					opacity: 0.3,
                     });
         
                     $('.panelHighlights').css({
                     	transform: 'translate(10%, -30%)',
                     });
         
                     $('.meterBG').css({
         					'background': 'rgba(0, 0, 0, 0.2)',
         					'box-shadow':'2px 2px 5px rgba(0, 0, 0, 0.3) inset, -2px -2px 5px rgba(255, 255, 255, 0.3) inset',            
                     });				
         
                     $('.meterFill').css({
                     	'background': 'linear-gradient(to bottom, '+ sym.getVariable('secondaryUIColour') +', '+ centreCol +', '+ sym.getVariable('secondaryUIColour') +')',
                     });     
         
                     $('.paddedText').css({
                     	padding: '0.5em',            
                     }); 
         
                     $('.leaderboardNumber').css({
         					color: sym.getVariable('secondaryUIColour'),
         					'font-size':'20px',
                     });
         
                     $('.leaderboardName').css({
         					color: 'white',
         					'font-size': '18px',
         					'text-align':'left',
                     });
         
                     $('.leaderboardScore').css({
         					color: 'white',
         					'text-align':'right',
         					'font-size':'24px',
                     });
         
                     $('sup').css({
         					'font-size':'xx-small',
         					'vertical-align':'super',
                     });
         
                     $('.scoreTagline').css({
         					'font-size':'3em',
         					'text-transform':'uppercase',
                     });            
         
                     $('.pauseBox').css({
                     	padding:'2em',
                     }); 
         
                     $('.gameOverScreen').css({
         					margin:'1em',
         					'text-align':'center',
         					color: sym.getVariable('darkTextColour'),
                     });
         
                     $('h1.gameOverScreen').css({
                     'font-size':'5em',
                     });
         
                     $('p.gameOverScreen').css({
                     'font-size':'2.5em',
                     });
         
                     $('.replayButton').css({
         					margin: '4em 0 0',
         					'padding-bottom': '25%',
                     });
         
                     $('.replayButton h2').css({
                     'font-size':'2.7em',
                     });
                     
                     $('.pauseElement').css({
                     position: 'absolute',
                     height: '50%', width: '1.2vw',
                     background: 'white',
                     left: '50%', top: '50%',
                     transform: 'translate(-50%, -50%)',
                     'border-radius': '1.2vw',
                     });
                     
                     $('#pause_element_left').css({
                     transform: 'translate(-180%, -50%)',
                     });
                     
                     $('#pause_element_right').css({
                     transform: 'translate(80%, -50%)',
                     });
                     
                     $('#pause_element_left_cross').css({
                     transform: 'translate(-50%, -50%) rotate(-45deg)',
                     });
                     
                     $('#pause_element_right_cross').css({
                     transform: 'translate(-50%, -50%) rotate(45deg)',
                     });
                  } 
         
         			$(document).ready(scaleStage);
                  $(window).on('resize', scaleStage);
         
                  function scaleStage()
                  {
                  	scaleFactor = $('.center-wrapper').width()/720;
         
                  	if(grid)         	
                  		grid.scaleFactor = scaleFactor;
                  }
         
                  function numberWithCommas(x) {
         				 return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         			}
         

      });
      //Edge binding end

      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         // insert code to be run when the symbol is created here
         sym.setVariable('mainUIColour', '#000');
         sym.setVariable('secondaryUIColour', '#C0C0C0');
         sym.setVariable('darkTextColour', '#474747');
         

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

   //=========================================================
   
   //Edge symbol: 'Preloader'
   (function(symbolName) {   
   
   })("Preloader");
   //Edge symbol end:'Preloader'

   //=========================================================
   
   //Edge symbol: 'animatedScroll'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 500, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

   })("animatedScroll");
   //Edge symbol end:'animatedScroll'

   //=========================================================
   
   //Edge symbol: 'readAgainIcon'
   (function(symbolName) {   
   
   })("readAgainIcon");
   //Edge symbol end:'readAgainIcon'

   //=========================================================
   
   //Edge symbol: 'pageFold_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1566, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      

      

      

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      

   })("pageFold");
   //Edge symbol end:'pageFold'

   //=========================================================
   
   //Edge symbol: 'pageClosed'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 0, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
         // insert code here
         sym.stop();

      });
      //Edge binding end

   })("pageClosed");
   //Edge symbol end:'pageClosed'

   //=========================================================
   
   //Edge symbol: 'baseTray'
   (function(symbolName) {   
   
   })("baseTray");
   //Edge symbol end:'baseTray'

   //=========================================================
   
   //Edge symbol: 'miscTray'
   (function(symbolName) {   
   
   })("miscTray");
   //Edge symbol end:'miscTray'

   //=========================================================
   
   //Edge symbol: 'garnishTray'
   (function(symbolName) {   
   
   })("garnishTray");
   //Edge symbol end:'garnishTray'

   //=========================================================
   
   //Edge symbol: 'milkTray'
   (function(symbolName) {   
   
   })("milkTray");
   //Edge symbol end:'milkTray'

   //=========================================================
   
   //Edge symbol: 'baseTrayOpen'
   (function(symbolName) {   
   
   })("baseTrayOpen");
   //Edge symbol end:'baseTrayOpen'

   //=========================================================
   
   //Edge symbol: 'steamSpritesheet_symbol_1'
   (function(symbolName) {   
   
      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 1208, function(sym, e) {
         // insert code here
         sym.play();

      });
      //Edge binding end

   })("steamSpritesheet_symbol_1");
   //Edge symbol end:'steamSpritesheet_symbol_1'

   //=========================================================
   
   //Edge symbol: 'pauseButton'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         // insert code to be run when the symbol is created here
         sym.$('Text').html('<h2 class="pauseSymbol">II</h2>');
         

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${HS}", "click", function(sym, e) {
         // insert code for mouse click here
         var tl = new TimelineMax();
         tl.to(sym.$('base'), .1, {scaleY: 0.95, scaleX: 1.05});
         tl.to(sym.$('base'), .1, {scaleY: 1.05, scaleX: 0.95});
         tl.to(sym.$('base'), .05, {scale: 1});

      });
      //Edge binding end

   })("pauseButton");
   //Edge symbol end:'pauseButton'

   //=========================================================
   
   //Edge symbol: 'panel'
   (function(symbolName) {   
   
   })("panel");
   //Edge symbol end:'panel'

   //=========================================================
   
   //Edge symbol: 'pauseMenu'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         // insert code to be run when the symbol is created here
         $('#' + sym.ele.id).css({'z-index': 5000});
         
         //style close button
         sym.getSymbol('closeButton').$('Text').html('<h2 class="pauseSymbol">&#10006;&#xFE0E;</h2>');
         //add clicks
         sym.$('closeButton').click(function(){
         	sym.hide();
         });
         
         sym.$('retryButton').click(function(){
         	$('#' + sym.ele.id).remove();	
         	sym.getComposition().getStage().reload();
         });
         
         sym.$('resumeButton').click(function(){
         	sym.hide();
         });
         sym.$('exitButton').click(function(){
         	window.parent.postMessage('{"action":"closeGame"}', '*');
         });
         
         sym.getSymbol('musicCheckBox').$('HS').click(function(){
         	var s = sym.getComposition().getStage().getSettings();
         	s.music = !s.music;
         	sym.getComposition().getStage().setSettings(s);
         	sym.getSymbol('musicCheckBox').$('tick').toggle();
         
         	var items = document.querySelectorAll('audio');
         	var a = [];
         	for(var i = 0; i < items.length; i++)
         		a.push(items[i]);
         		
         	a.forEach(function(content){
         		if(content.classList.contains('music'))
         		{
         			if(s.music)
         				content.muted = false;
         			else
         				content.muted = true;
         		}
         	});	
         });
         
         sym.getSymbol('soundsCheckBox').$('HS').click(function(){
         	var s = sym.getComposition().getStage().getSettings();
         	s.sounds = !s.sounds;
         	sym.getComposition().getStage().setSettings(s);
         	sym.getSymbol('soundsCheckBox').$('tick').toggle();
         
         	var items = document.querySelectorAll('audio');
         	var a = [];
         	for(var i = 0; i < items.length; i++)
         		a.push(items[i]);
         		
         	a.forEach(function(content){
         		if(content.classList.contains('soundEffect'))
         		{
         			if(s.sounds)
         				content.muted = false;
         			else
         				content.muted = true;
         		}
         	});	
         });
         
         //style title text
         sym.$('titleText').html('<h3>Game Paused<h3>');
         
         //check settings
         var s = sym.getComposition().getStage().getSettings();
         if(!s.music)
         	sym.getSymbol('musicCheckBox').$('tick').hide();
         if(!s.sounds)
         	sym.getSymbol('soundsCheckBox').$('tick').hide();
         
         sym.getSymbol('musicCheckBox').$('Text').html('<h4 class="labelText">Music</h4>');
         sym.getSymbol('soundsCheckBox').$('Text').html('<h4 class="labelText">Sound Effects</h4>');
         
         //set exit and resumeText
         sym.getSymbol('exitButton').$('image').css({opacity: 1,});
         sym.getSymbol('retryButton').$('image').css({'background-image':'url(images/replayIcon.png)', opacity: 1});
         sym.getSymbol('resumeButton').$('image').css({'background-image':'url(images/playIcon.png)', opacity: 1});
         sym.getSymbol('exitButton').$('Text').hide();
         sym.getSymbol('resumeButton').$('Text').hide();
         sym.getSymbol('retryButton').$('Text').hide();
         sym.$('exitText').html('<h4>Quit Game</h4>');
         sym.$('resumeText').html('<h4>Resume</h4>');
         sym.$('retryText').html('<h4>Restart</h4>');
         
         //set info groups
         var labels = ['Matches', 'Level', 'Score'];
         var info = sym.getComposition().getStage().getInfo();
         var infoKeys = Object.keys(info);
         labels.forEach(function(content, index){
         	sym.getSymbol('infoGroup' + index).$('Text').html('<h3 class="statsLabel">'+ content +'</h3>');
         	sym.getSymbol('infoGroup' + index).getSymbol('infoPanel').$('Text').html('<h2 class="arialText stats">'+ info[infoKeys[index]] +'</h2>')
         });
         
         sym.hide = function()
         {
         	sym.getComposition().getStage().pauseGame(false);
         	$('#' + sym.ele.id).remove();	
         }

      });
      //Edge binding end

   })("pauseMenu");
   //Edge symbol end:'pauseMenu'

   //=========================================================
   
   //Edge symbol: 'checkBox'
   (function(symbolName) {   
   
   })("checkBox");
   //Edge symbol end:'checkBox'

   //=========================================================
   
   //Edge symbol: 'infoPanel'
   (function(symbolName) {   
   
   })("infoPanel");
   //Edge symbol end:'infoPanel'

   //=========================================================
   
   //Edge symbol: 'infoGroup'
   (function(symbolName) {   
   
   })("infoGroup");
   //Edge symbol end:'infoGroup'

   //=========================================================
   
   //Edge symbol: 'startButton'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         // insert code to be run when the symbol is created here
         /*
         for(var i = 0; i < 50; i++)
         {
         	var tmp = document.createElement('div');
         	var size = chance.integer({min: 5, max: 25});
         	$(tmp).css({
         	position: 'absolute',
         	left: (Math.random()*100) - 10 + '%',
         	top: (Math.random()*100) - 10 + '%',
         	width: size, height: size,
         	background: 'url(images/'+ chance.pickone(['snowflake0', 'snowflake1', 'snowflake2', 'snowflake3', 'snowflake4', 'snowflake5',]) +'.png) 50% 50%',
         	'background-repeat':'no-repeat',
         	'background-size':'contain',
         	});
         	$('#' + sym.ele.id).append(tmp);	
         
         	TweenMax.fromTo($(tmp), size/5, {scale: 0, alpha: 0}, {scale: 1, alpha: 1, yoyo: true, repeat: -1});
         }*/

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "${HS}", "click", function(sym, e) {
         // insert code for mouse click here
         var tl = new TimelineMax();
         tl.to(sym.$('base'), .1, {scaleY: 0.95, scaleX: 1.05});
         tl.to(sym.$('base'), .1, {scaleY: 1.05, scaleX: 0.95});
         tl.to(sym.$('base'), .05, {scale: 1});

      });
      //Edge binding end

   })("startButton");
   //Edge symbol end:'startButton'

   //=========================================================
   
   //Edge symbol: 'introScreen'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         $('#' + sym.ele.id).css({'z-index': 1000});
         
         var text = {
         title: 'Present Swap',
         body: 'Drag a present to swap it with its neighbour and try to match 3 in a row.<br><br>Get as many points as possible before time runs out.',
         };
         activeIntroScreen = document.createElement('div');
         activeIntroScreen.setAttribute('id', 'activeIntroScreen');
         $(activeIntroScreen).css({
         position: 'absolute',
         width: 500, height: 'auto',
         left: '50%', top: '50%',
         transform: 'translate(-50%, -50%)',
         'z-index': 1000,
         });
         $('#' + sym.ele.id).append(activeIntroScreen);
         
         var titleText = document.createElement('h1');
         titleText.innerHTML = text.title;
         $(titleText).css({
         position: 'relative',
         width: 'auto', height: 'auto',
         'text-align':'center',
         opacity: 0,
         });
         $(activeIntroScreen).append(titleText);
         anim($(titleText), 'fadeInUp', 0, 1);
         
         var divider = document.createElement('img');
         divider.setAttribute('src', 'images/divider.png');
         $(divider).css({
         position: 'relative',
         left: 100, top: 0,
         width: 300, height: 'auto',
         opacity: 0,				
         });
         $(activeIntroScreen).append(divider);
         anim($(divider), 'zoomIn', 0, 1);
         
         var body = document.createElement('p');
         body.innerHTML = text.body;
         $(body).css({
         position: 'relative',
         left: 100, top: 0,
         width: 300, height: 'auto',
         'text-align':'center',
         opacity: 0,
         });
         $(activeIntroScreen).append(body);
         anim($(body), 'fadeInDown', 0, 1);
         
         var startButton = sym.createChildSymbol('startButton', '#activeIntroScreen');
         startButton.$('Text').html('<h2>GO!</h2>');
         var elem = startButton.getSymbolElement();
         elem.css({
         position: 'relative',
         left: 206, top: 20,
         opacity: 0,
         });
         anim(elem, 'bounceIn', 0, 1);	
         elem.click(function(){
         	anim($(activeIntroScreen), 'fadeOut', 0, 1, function(){
         		$('#' + sym.ele.id).remove();
         		sym.getComposition().getStage().start();
         	});
         });			
         

      });
      //Edge binding end

   })("introScreen");
   //Edge symbol end:'introScreen'

   //=========================================================
   
   //Edge symbol: 'pauseMenu_1'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         // insert code to be run when the symbol is created here
         $('#' + sym.ele.id).css({'z-index': 5000});
         sym.$('pauseBox').animate({opacity: 1}, 500);
         
         sym.$('entry0').css({opacity: 0}, 0);
         sym.$('entry1').css({opacity: 0}, 0);
         sym.$('entry2').css({opacity: 0}, 0);
         
         //send the data to the database
         var s = sym.getComposition().getStage().getInfo();
         
         var score_details = {					
         "score": s.score,
         "matches": s.matches,
         "level": s.level,
         "time": s.totalTime,
         "ultimates": s.ultimates,
         "supers": s.supers,
         "clears": s.clears,
         };
         var JSON_Obj = {"action": "record_score", "data": score_details};
         window.parent.postMessage(JSON.stringify(JSON_Obj),'*');
         
         //add clicks
         sym.$('replayButton').click(function(){
         	sym.getComposition().getStage().reload();
         	$('#' + sym.ele.id).remove();
         });
         sym.$('leaderboardButton').click(function(){
         	window.parent.postMessage('{"action":"openLeaderboard"}', '*');
         });
         sym.$('exitButton').click(function(){
         	window.parent.postMessage('{"action":"closeGame"}', '*');
         });
         
         //style title text
         var score = s.score;
         sym.$('titleText').html('<h3>Game Over<h3>');
         sym.$('bodyText').html('<p>You scored <span class="arialText">'+ score +'</span> points!<p>');
         
         //set exit and resumeText
         sym.getSymbol('exitButton').$('image').css({opacity: 1,});
         sym.getSymbol('replayButton').$('image').css({'background-image':'url(images/replayIcon.png)', opacity: 1});
         sym.getSymbol('leaderboardButton').$('image').css({'background-image':'url(images/trophyIcon.png)', opacity: 1, transform:'translate(2px, 2px)'});
         sym.getSymbol('exitButton').$('Text').hide();
         sym.getSymbol('replayButton').$('Text').hide();
         sym.getSymbol('leaderboardButton').$('Text').hide();
         sym.$('exitText').html('<h4>Quit Game</h4>');
         sym.$('resumeText').html('<h4>Replay</h4>');
         sym.$('leaderboardText').html('<h4>Leaderboard</h4>');
         
         sym.setLeaderboardDisplay = function(entries)
         {
         	/*
         	var entries = [
         	{name: {first: 'Giuseppe', last: 'Stubbs'}, position: 2, score: 18000},
         	{name: {first: 'Leeway', last: 'Walken'}, position: 1, score: 21000},
         	{name: {first: 'Patches', last: 'O\'Houlihan'}, position: 3, score: 17000},
         	];*/
         
         	var tmp = entries[0];
         	entries[0] = entries[1];
         	entries[1] = tmp;	
         
         	entries.forEach(function(content, index){
         		if(index == 0 || index == 2)
         			sym.$('entry' + index).css({transform: 'scale(0.9)'});
         
         		var suffix = 'th';
         		var pos = content.position.toString();
         
         		if(pos[pos.length - 1] == '1')
         			suffix = 'st'
         
         		if(pos[pos.length - 1] == '2')
         			suffix = 'nd'
         
         		if(pos[pos.length - 1] == '3')
         			suffix = 'rd'
         
         		if(pos == '11'|| pos == '12' || pos == '13')
         			suffix = 'th',
         
         		console.log();		
         		sym.getSymbol('entry' + index).$('numberText').html('<h3 class="leaderboardNumber">'+ content.position +'<sup>'+ suffix +'</sup></h3>');
         		sym.getSymbol('entry' + index).$('nameText').html('<h3 class="leaderboardName">'+ (content.name.first ? content.name.first : '') + '<br>' + (content.name.last ? content.name.last : '') +'</h3>');
         		sym.getSymbol('entry' + index).$('scoreText').html('<h3 class="leaderboardScore arialText">'+ content.score +'</h3>');
         	});
         	sym.getComposition().getStage().styleElements();
         
         	var symbols = [sym.$('entry0'), sym.$('entry1'), sym.$('entry2')];
         	var hides = [sym.$('titleContainer'), sym.$('bodyContainer'), sym.$('divider')];
         	TweenMax.to(hides, 0.5, {opacity: 0, delay: 3, onComplete: function(){
         		TweenMax.to(symbols, 0.5, {opacity: 1});
         	}});	
         
         }

      });
         //Edge binding end

      })("gameOverScreen");
   //Edge symbol end:'gameOverScreen'

   //=========================================================
   
   //Edge symbol: 'leaderboardEntry'
   (function(symbolName) {   
   
   })("leaderboardEntry");
   //Edge symbol end:'leaderboardEntry'

})(window.jQuery || AdobeEdge.$, AdobeEdge, "EDGE-2597805");