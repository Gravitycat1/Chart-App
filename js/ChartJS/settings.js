'use strict';
// For all settings fucntions ------------>

// Global variables
var textColor;
var rowColor1, rowColor2;


function Settings_textSize () {
	//This changes the size of text
	var newTextSize = document.getElementById('inpText').value;
	var changeSize = '16px';
	
	changeSize = newTextSize + "px";
				
	var emLength = document.getElementsByTagName('tr').length;
	for(var x = 0; x < emLength; x++) {
		document.getElementsByTagName('tr')[x].style.fontSize = changeSize;
	}
}

function Settings_textColor () {
	textColor = "#" + document.getElementById('inpTextColor').value;

	//You can only change "getElementsByTagName" this way, don't attempt to change the following code. 1--
	var pLength

	pLength = document.getElementsByTagName('tr').length;
	for(var x = 0; x < pLength; x++) {
		document.getElementsByTagName('tr')[x].style.color = textColor;
	}

	pLength = document.getElementsByTagName('option').length;
	for(var x = 0; x < pLength; x++) {
		document.getElementsByTagName('option')[x].style.color = textColor;
	}
	
	pLength = document.getElementsByTagName('select').length;
	for(var x = 0; x < pLength; x++) {
		document.getElementsByTagName('select')[x].style.color = textColor;
	}
	// --1
}

function Settings_rowColor () {

	rowColor1 = "#" + document.getElementById('inpColorScheme1').value;
	rowColor2 = "#" + document.getElementById('inpColorScheme2').value;
	var rowLength = document.getElementById('table1').rows.length;
	
	/*	Change the background color for all the ODD rows	*/
	for(var x = 2; x < rowLength; x += 2) {
		document.getElementById('table1').rows[x].style.background = rowColor1;
	}
	/*	Change the background color for all the EVEN rows	*/
	for(var x = 1; x < rowLength; x += 2) {
		document.getElementById('table1').rows[x].style.background = rowColor2;
	}
	document.getElementById('table1').rows[0].style.background = rowColor1;
	//document.getElementById('table1').rows[(rowLength - 1)].style.background = rowColor1;
}

function Settings_all () {
	Settings_textSize();
	Settings_textColor();
	Settings_rowColor();
}