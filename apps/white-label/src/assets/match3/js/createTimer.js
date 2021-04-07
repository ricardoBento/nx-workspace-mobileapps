function Timer(textLocation, from, to, options)
{	
	var displayType = options ? options.display || 'padded' : 'padded';	
	var callback = options ? options.onComplete || null : null;	
	var update = options ? options.onUpdate || null : null;
	var startFunc = options ? options.onStart || null : null;
	var preText = options ? options.preText || null : null;
	var postText = options ? options.postText || null : null;

	var textLoc = textLocation;
	var from = from;
	var to = to;
	var endString = null;	
	var timer = from;
	var callback = callback;
	var countingDown = false;
	var x;
	
	if(typeof to == 'string')
	{
		endString = to;
		to = 0;
	}				
	
	if(from > to)
		countingDown = true;
		
	UpdateUI();
	
	this.start = function(val)
	{
		if(typeof startFunc == 'function')
			startFunc();
		
		if(val)
		{
		  from = val;
		  timer = from;
		  UpdateUI();
		}
		
		x = setInterval(function(){
			
			if(countingDown)
				timer--;
			else	
				timer++;			
			
			UpdateUI()
			
			if(typeof update == 'function')
				update();
			
			if(countingDown && timer <= to || !countingDown && timer >= to)
			{
				stop();
				
				if(typeof callback == 'function')
					callback();
			}
			
		}, 1000);
	}
	
	this.display = function(val)
	{
		if(!val)
			return displayType;
		
		switch(val)
		{
			case 'padded':
			case 'decimal':
			case 'minutes':
			case 'hours':
			break;
			default: return;
			break;
		}
		displayType = val;
	}
	
	function UpdateUI()
	{
		var timeString = '';
		var h = Math.floor(timer/3600) % 60;
		var m = Math.floor(timer/60) % 60;
		var s = timer % 60; 
		
		switch(displayType)
		{
			case 'padded':	enterText(padNum(timer));									
			break;
			case 'decimal': enterText(timer);
			break;
			case 'minutes': timeString = padNum(m) + ':' + padNum(s);
							enterText(timeString);				
			break;
			case 'hours':	timeString = padNum(h) + ':' + padNum(m) + ':' + padNum(s);
							enterText(timeString);				
			break;
			default:		enterText(padNum(timer));
			break;
		}
		
		if(endString && timer <= 0)
			textLoc.html(endString);
	}
	
	function enterText(val)
	{
		if(typeof preText == 'string')
			val = preText + val;
		
		if(typeof postText == 'string')
			val += postText;
		
		textLoc.html(val);
	}
	
	function padNum(num)
	{
		var timeString = num.toString();
		if(num < 10)
			timeString = '0' + num.toString();
		
		return timeString;			
	}

	function stop()
	{
		clearInterval(x);
	}
	
	this.stop = function()
	{
		clearInterval(x);
	}
	
	//---------------------------------------------------------
	//---------------------------------------------------------
	//Add-on Functions, for changing properties after creation
	//---------------------------------------------------------
	//---------------------------------------------------------
	this.set = function(val)
	{
		if(typeof val != 'number')
		return from;
	
		from = val;
		timer = from;
		UpdateUI();
	}
	
	this.time = function()
	{
		return timer;
	}	
	
	this.preText = function(val)
	{
		if(!val)
		return preText;
	
		if(typeof val == 'string')
			preText = val;
	}	
	
	this.postText = function(val)
	{
		if(!val)
		return postText;
	
		if(typeof val == 'string')
			postText = val;
	}
	
	this.onStart = function(val)
	{
		if(!val)
		return startFunc;
		
		if(typeof val != 'function')
			return;
		startFunc = val;
	}	
	
	this.onUpdate = function(val)
	{
		if(!val)
		return update;
		
		if(typeof val != 'function')
			return;
		update = val;
	}
	
	this.onComplete = function(val)
	{
		if(!val)
		return callback;
		
		if(typeof val != 'function')
			return;
		callback = val;
	}
	
	
}