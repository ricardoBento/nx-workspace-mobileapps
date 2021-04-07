function Recolour(colour, symbolName)
{		
	//get the background-image url, take off the unneeded characters at the start and end of the
	//string to get the file name and location (only works on pngs but the recolouration wouldn't work on jpgs anyway)	
	//create a new image object
	var image = new Image();
	//set the image source to the once taken from the relevant symbol
	image.src = './images/' + imageName + '.png';

	image.onload = function(){
	  //once the image has loaded, create a temporary canvas		
	  var canvas = document.createElement('canvas');
	  //set this to the same size as the image
	  canvas.width = image.width;
	  canvas.height = image.height;

	  var ctx = canvas.getContext('2d');	  
	  //draw the image to the canvas	  
	  ctx.drawImage(image, 0, 0);  	  
	  //create an array with all the pixel data from the image in rgba format
	  var imageData = ctx.getImageData(0, 0, image.width, image.height);
	  var data = imageData.data;

	  //convert the colour into rgb values
	  var rgbVal = hex2rgb(colour);

	  var rVal = rgbVal[0];
	  var gVal = rgbVal[1];
	  var bVal = rgbVal[2];

	  //cycle through the pixel data and overwrite the existing colours with the new colour
	  for (var i = 0; i < data.length; i += 4) {	  	
		data[i]     = rVal; 	// red
		data[i + 1] = gVal;  // green
		data[i + 2] = bVal; // blue
	  }
	  //replace the image data with the modified data	  
	  ctx.putImageData(imageData, 0, 0);	  

	  //create a new image object
	  var recolouredImage = new Image();
	  //store the canvas image to this new object
	  recolouredImage = canvas.toDataURL();
	  //replace the background image of the targeted symbol with the newly generated, recoloured image
	  symbolName.css({'background-image': 'url(' + recolouredImage + ')'});
	}
}

function hex2rgb(hexStr){   
	 //take off the # sign and covert the hex values to separate rgb values
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b];
}
