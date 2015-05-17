'use strict';
// For all settings fucntions ------------>

// Global variables
var textColor, barColor, areaColor;
var rowColor1, rowColor2;


function Settings_textSize () {
	//This changes the size of text
	var newTextSize = document.getElementById('inpText').value;
	var changeSize = '16px';
	
	changeSize = newTextSize + "px";
				
    document.getElementById('heading').style.fontSize = changeSize;
	document.getElementById('container').style.fontSize = changeSize;
	
	var emLength = document.getElementsByTagName('tick').length; //broken
	for(var x = 0; x < emLength; x++) { //loops are in place to change parameters for the g tags
		document.getElementsByTagName('tick')[x].style.fontSize = changeSize;
	}
	
}

function Settings_textColor () {
	textColor = "#" + document.getElementById('inpTextColor').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength

	pLength = document.getElementsByTagName('g').length;
	
	document.getElementById('heading').style.color = textColor;
	document.getElementById('container').style.color = textColor;
	
	pLength = document.getElementsByClassName('tick').length; //broken
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('tick')[x].style.color = textColor;
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

	//document.getElementById('table1').rows[0].style.background = rowColor1;
	//document.getElementById('table1').rows[(rowLength - 1)].style.background = rowColor1;
}

function Settings_barColor () {
	barColor = "#" + document.getElementById('inpColorScheme3').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength

	
	pLength = document.getElementsByClassName('volume').length; //broken
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('volume')[x].style.fill = barColor;
	}
	

	// --1
}

function Settings_areaColor () {
	areaColor = "#" + document.getElementById('inpColorScheme4').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength

	
	pLength = document.getElementsByClassName('area').length; //broken
	for(var x = 0; x < pLength; x++) {
		document.getElementsByClassName('area')[x].style.fill = areaColor;
	}
	

	// --1
}


function Settings_all () {
	Settings_textSize();
	Settings_barColor();
	Settings_areaColor();
	Settings_textColor();
	Settings_rowColor();
}