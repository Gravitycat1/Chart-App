'use strict';

function Runner () {}

/**
 * Loads data from AppData
 * 
 * @param  {AppData Instance} AppData 
 * 
 * @param  {String} stockId 
 * 
 * @return {AppData}      
 *    
 */
Runner.loadData = function loadData(AppData, stockId){
 	var checks = 0;
	//-----------------------------------------
	// /v1/fundamentals
	//-----------------------------------------
	Runner.clearUL('fundamental-data');//	Clear ul for fundmentals
	AppData.v1.fundamental.GET(stockId,'epsbase')
	.then(function(data){

		Runner.createTable(data.response.data,'fundamental-data')

	}, function(jqXHR){

		throw new Error('Failed to load data!',jqXHR);

	}).then(function(){

		checks ++;
		if(checks === 2){
			Runner.toggleOverhead();
		}

	});
	AppData.v1.Tickerlist.GET('json')
	.then(function(data){
		console.log(data);
	});
	//-----------------------------------------
	// /v1/pricedata
	//-----------------------------------------
	Runner.clearUL('price-data');//	Clear ul for price-data
	AppData.v1.pricedata.GET(stockId)
	.then(function(data){
		Runner.createTable(data.response.data.slice(0,20),'price-data')

	}, function(jqXHR){

		throw new Error('Failed to load data!',jqXHR);
	}).then(function(){
		checks ++;
		if(checks === 2){
			Runner.toggleOverhead();
		}
	});

	return AppData;
};

/**
 * Clears the ul in a container
 * @param  {String} containerId 
 * @return {Null}             
 */
Runner.clearUL = function clearUL(containerId) {
 	document.getElementById(containerId).getElementsByTagName('ul')[0].innerHTML = '';
 	return;
};

/**
 * Toggles the overhead animation
 * @return {Number} old opacity settings
 */
Runner.toggleOverhead = function toggleOverhead() {

	var op = Math.ceil(parseFloat($('.overhead span').css('opacity')));

 	if( op === 1){
 		$('.overhead').css({height:0});
 		$('.overhead div').css({opacity:0});
 		$('.overhead span').css({opacity:0});
 	} else if( op === 0 ) {
 		$('.overhead').css({height:'100%'});
 		$('.overhead div').css({opacity:1});
 		$('.overhead span').css({opacity:1});		
 	}

 	return op;
};

/**
 * Creates a table out of a data Array
 * @param  {Array} data        
 * @param  {String} containerId 
 * @return {DOM}    contaiment div       
 */
Runner.createTable = function createTable(data, containerId) {

 	var div = document.getElementById(containerId);
 	var ul = div.getElementsByTagName('ul')[0]
 	var li; var span; var price; var date;	

 	for (var i = data.length - 1; i >= 0; i--) {
		//-----------------------------------------
		//	Set Date and price
		//-----------------------------------------
		date = new Date(data[i][0]);
		date = (date.getUTCMonth()+1) + '/' + date.getDate() + '/' +  date.getUTCFullYear();
		price = data[i][1];

		//-----------------------------------------
		//	Append to li
		//-----------------------------------------
		li = document.createElement('li');
		span = document.createElement('span');
		li.appendChild(span);

		//-----------------------------------------
		//	Append to ul
		//-----------------------------------------
		span.innerHTML = 'date: ' + date + ', price: ' + price;
		ul.appendChild(li);
	};

	if( !div ) throw new Error('no container!');

	div.appendChild(ul);//	Append to div

	return div;
};