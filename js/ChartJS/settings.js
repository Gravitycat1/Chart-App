'use strict';
// For all settings fucntions ------------>

// Global variables
var textColor, barColor, areaColor, zoomColor, strokeColor;
var rowColor1, rowColor2;


function Settings_textSize () {
	//This changes the size of text
	var newTextSize = document.getElementById('inpText').value;
	var changeSize = '14px';
	
	changeSize = newTextSize + "px";
				
    document.getElementById('heading').style.fontSize = changeSize;
	document.getElementById('container').style.fontSize = changeSize;
	
	var emLength = document.getElementsByTagName('text').length; 
	for(var x = 0; x < emLength; x++) { 
		document.getElementsByTagName('text')[x].style.fontSize = changeSize;
	}
	
}

function Settings_textColor () {
	textColor = "#" + document.getElementById('inpTextColor').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength
	
	document.getElementById('heading').style.color = textColor;
	document.getElementById('container').style.color = textColor;
	
	pLength = document.getElementsByTagName('text').length; //broken
	for(var x = 0; x < pLength; x++) {
		document.getElementsByTagName('text')[x].style.fill = textColor;
	}
	

	// --1
}


function Settings_rowColor () {

	rowColor1 = "#" + document.getElementById('inpColorScheme1').value;
	rowColor2 = "#" + document.getElementById('inpColorScheme2').value;
	
	/*	Change the background color for all the ODD rows	*/
	document.getElementById('heading').style.background = rowColor1;
	
	/*	Change the background color for all the EVEN rows	*/
	document.getElementById('table-row').style.background = rowColor2;
}

function Settings_barColor () {
	barColor = "#" + document.getElementById('inpColorScheme3').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength

	
	pLength = document.getElementsByClassName('volume').length; 
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('volume')[x].style.fill = barColor;
	}
	

	// --1
}

function Settings_areaColor () {
	areaColor = "#" + document.getElementById('inpColorScheme4').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength

	
	pLength = document.getElementsByClassName('area').length; 
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('area')[x].style.fill = areaColor;
	}
	

	// --1
}

function Settings_zoomColor () {
	zoomColor = "#" + document.getElementById('inpColorScheme5').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength
	
	
	pLength = document.getElementsByClassName('zoomTime').length; 
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('zoomTime')[x].style.color = zoomColor;
	}
	

	// --1
}

function Settings_strokeColor () {
	strokeColor = "#" + document.getElementById('inpColorScheme6').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength
	
	pLength = document.getElementsByClassName('area').length; 
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('area')[x].style.stroke = strokeColor;
	}
	

	// --1
}


function Settings_all () {
	Settings_textSize();
	Settings_barColor();
	Settings_areaColor();
	Settings_textColor();
	Settings_zoomColor();
	Settings_strokeColor();
	Settings_rowColor();
}