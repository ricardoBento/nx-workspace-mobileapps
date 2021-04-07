//function to animate a symbol in Edge
function anim(symbol, animation, delay, duration, callback)
{
	symbol.show().addClass('animated ' + animation).css({
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
