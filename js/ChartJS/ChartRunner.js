'use strict';

function Runner() {}

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
  var priceData = new Array();
  var dateOfData = new Array();
  var i = 0;
  var flag;
Runner.loadData = function loadData(AppData, stockId){
 	var checks = 0;
	//-----------------------------------------
	// /v1/fundamentals
	//-----------------------------------------
	AppData.v1.fundamental.GET(stockId,'epsbase')
	.then(function(data){

	console.log(data);

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
		console.log("Number of objects: " + data.response.length);
		
		var lengthOfResponse= data.response.length;
		var tickers= new Array()
		for(i = 0;i < lengthOfResponse;i++){

        tickers[i]= data.response[i].Ticker
		}


		$(function autocomplete(){
			
		  // Set up auto-complete function pulling from StockRender data array
		  $("#stock").autocomplete({
			lookup: tickers,
			onSelect: function (suggestion) {
			  var thehtml = '<strong>Currency Name:</strong> ' + suggestion.value + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
			  $('#outputcontent').html(thehtml);
			  $("#stock").focus();
			}
		  });
		  

})
	});
	//-----------------------------------------
	// /v1/pricedata
	//-----------------------------------------
	AppData.v1.pricedata.GET(stockId)
	.then(function(data){

		for(var i = data.response.data.slice(0,365).length - 1; i >= 0; i--){

        priceData[i] = data.response.data.slice(0,365)[i];
		dateOfData[i] = data.response.data.slice(0,365)[i][0];
		
	
		
		}
      console.log(data);
      console.log(priceData); //price data array with every information

	}, function(jqXHR){

		throw new Error('Failed to load data!',jqXHR);
	}).then(function(){
		checks ++;
		if(checks === 2){
		}
	});

	return AppData;
	flag = 1;
};