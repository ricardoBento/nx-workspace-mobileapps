
$(document).ready(function(){	
	//inject the styles for h1-h6 and p into the head of the document
	injectStyles();
});



function injectStyles()
{
	//inject styles into head of document
	var style = document.createElement('style');
	document.head.append(style);

	var css = [];
	css.push(
	'h1, h2, h3, h4, h5, h6,p {' + 
	'font-family: Montserrat-ExtraBold;' + 
	'line-height: 1;' +	 
	'font-weight: 400;' +	 
	'}');

	css.push(
	'h1 {' +  
	'color: white;' + 
	'font-size: 8em;' + 
	'text-transform: uppercase;' + 
	'font-weight: 900;' + 	
	'transform: skew(0, -5deg);' + 	
	'}');

	css.push(
	'h2 {' +  
	'color: white;' + 
	'font-size: 4em;' + 
	'text-transform: uppercase;' + 
	'font-weight: 900;' + 
	'}');

	css.push(
	'h3 {' + 
	'font-size: 20px;' + 
	'}');

	css.push(
	'h4 {' + 
	'font-size: 18px;' + 
	'}');

	css.push(
	'h5 {' + 
	'font-size: 16px;' + 
	'}');

	css.push(
	'h6 {' + 
	'font-size: 14px;' + 
	'}');

	css.push(
	'p {' + 
	'font-family: Montserrat-Regular;' + 
	'font-size: 3.5em;' + 
	'font-weight: 100;' + 
	'color: white;' + 
	'}');

	css.push(
	'.centeredText {' + 
	'position: absolute;' + 
	'left: 0;' + 
	'top: 50%;' + 
	'width: 100%;' + 
	'height: auto;' + 
	'transform: translate(0, -50%);' + 
	'text-align: center;' + 
	'margin: 0;' + 
	'padding: 0;' + 
	'}');


	css.forEach(function(content){		
		style.append(document.createTextNode(content));
	});
}

//function to animate a symbol in Edge
function anim(symbol, animation, delay, duration, callback)
{
	symbol.show().removeClass().addClass('animated ' + animation).css({
	'animation-delay': delay + 's',
	'-webkit-animation-delay': delay + 's',
	'animation-duration': duration + 's',
	'-webkit-animation-duration': duration + 's',
	}).one('animationend webkitanimationend', function(){
		if(typeof callback == 'function')
			callback();
	});
}

//function to remap one scale of numbers to another
function map(num, in_min, in_max, out_min, out_max) 
{
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
