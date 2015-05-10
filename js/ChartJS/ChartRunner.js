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
      //console.log(data);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var data = [{
			"volume": "10",
			"sale": "150",
			"year": "1999"
		}, {
			"volume": "20",
			"sale": "200",
			"year": "2001"
		}, {
			"volume": "10",
			"sale": "150",
			"year": "2002"
		}, {
			"volume": "20",
			"sale": "250",
			"year": "2003"
		}, {
			"volume": "10",
			"sale": "300",
			"year": "2007"
		}, {
			"volume": "15",
			"sale": "250",
			"year": "2010"
		}, {
			"volume": "25",
			"sale": "100",
			"year": "2011"
		}, {
			"volume": "35",
			"sale": "200",
			"year": "2015"
		}];
		
		
		var marginOfChart = {top: 10, right: 30, bottom: 300, left: 40},
			marginOfBrush = {top: 560, right: 10, bottom: 20, left: 40},
			marginOfVolume =  {top: 430, right: 10, bottom: 50, left: 40},
			width = 960 - marginOfChart.left - marginOfChart.right,
			width2 = 960 - marginOfVolume.left - marginOfVolume.right,
			heightOfChart = 700 - marginOfChart.top - marginOfChart.bottom,
			heightOfBrush = 640 - marginOfBrush.top - marginOfBrush.bottom,
			heightOfVolume = 600 - marginOfVolume.top - marginOfVolume.bottom;
		
		//Format years to scalable time
		var parseDate = d3.time.format("%Y").parse;
		
		//X SCALE//
		
		//x scale for main chart
		var xScaleOfChart = d3.time.scale().range([width, 0]).domain([d3.min(data, function(d) {
			return parseDate(d.year);
		}), d3.max(data, function(d) {
			return parseDate(d.year);
		})]);
		
		//x scale for brush
		var xScaleOfBrush = d3.time.scale().range([width, 0]).domain([d3.min(data, function(d) {
			return parseDate(d.year);
		}), d3.max(data, function(d) {
			return parseDate(d.year);
		})]);
		
		//x scale for volume
		var xScaleOfVolume = d3.time.scale().range([0, width]).domain([d3.min(data, function(d) {
			return parseDate(d.year);
		}), d3.max(data, function(d) {
			return parseDate(d.year);
		})]);
		
		//Y SCALES//
		 
		//y scale for main chart
		var yScaleOfChart = d3.scale.linear().range([heightOfChart,0]).domain([d3.min(data, function(d) {
			return d.sale;
		}) - 50, d3.max(data, function(d) {
			return d.sale;
		})]);
		
		//Add y scale for volume chart
		var yScaleOfVolume = d3.scale.linear().range([heightOfVolume, 0]).domain([d3.min(data, function(d) {
			return d.volume;
		}), d3.max(data, function(d) {
			return d.volume;
		})]);
		
		//y scale for brush
		var yScaleOfBrush = d3.scale.linear().range([heightOfBrush, 0]).domain([0, d3.max(data, function(d) {
			return d.sale;
		})]);
		
			
        //Defines the canvas where the chart will be generated		
		var svg = d3.select("body").append("svg")
									.attr("width", width + marginOfChart.left + marginOfChart.right)
									.attr("height", heightOfChart + marginOfChart.top + marginOfChart.bottom);
		
		//Axes
		var xAxisOfChart = d3.svg.axis().scale(xScaleOfChart).orient("bottom");
		var xAxisOfBrush = d3.svg.axis().scale(xScaleOfBrush).orient("bottom");
		var xAxisOfVolume = d3.svg.axis().scale(xScaleOfVolume).orient("bottom"); 
		var yAxisOfChart = d3.svg.axis().scale(yScaleOfChart).orient("right");
		var yAxisOfVolume = d3.svg.axis().scale(yScaleOfVolume).orient("right").tickFormat(d3.format("0s")).ticks(5);
		

		//Defines the brush.
		var brush = d3.svg.brush()
							.x(xScaleOfBrush) 
							.on("brush", brushed);
							
		var area = d3.svg.area()
				  .x(function(d) {
					return xScaleOfChart(parseDate(d.year));
				  })
				  .y0(heightOfChart)
				  .y1(function(d) {
					return yScaleOfChart(d.sale);
				  })
				  .interpolate("linear");
		
		//Define the bars for the volume chart. I don't think this is relevant any more.
		var volumeBars = d3.svg.line()
					.x(function(d) { return x(d.year); })
					.y(function(d) { return yScaleOfVolume(d.volume); });
		
		var areaOfBrush = d3.svg.area()
				  .x(function(d) {
					return xScaleOfBrush(parseDate(d.year));
				  })
				  .y0(heightOfBrush)
				  .y1(function(d) {
					return yScaleOfBrush(d.sale);
				  })
				  .interpolate("linear");
	
		
		//Assures that the area of the chart remains within the axes, not the canvas.							
		svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", heightOfChart);
			
		//Defines the chart.	
		var focus = svg.append("g")
			.attr("class", "focus")
			.attr("transform", "translate(" + marginOfChart.left + "," + marginOfChart.top + ")");
		
		//Define the bar chart.
		var volumeChart = svg.append("g")
			.attr("class", "volumeChart")
			.attr("transform", "translate(" + marginOfVolume.left + "," + marginOfVolume.top + ")");
		
        //Defines the brush
		var context = svg.append("g")
			.attr("class", "context")
			.attr("transform", "translate(" + marginOfBrush.left + "," + marginOfBrush.top + ")");
			
		//Grid lines
		xAxisOfChart.innerTickSize(-heightOfChart).outerTickSize(0).tickPadding(5) ;
		yAxisOfChart.innerTickSize(-width).outerTickSize(0).tickPadding(5);
		yAxisOfVolume.innerTickSize(-width).outerTickSize(0).tickPadding(5);
		
		//Generates the actual chart.
		focus.append('path')
		     .datum(data)
		     .attr("class", "area")
		     .attr('d', area);		  
		focus.append("g")
				.attr("class","axis")
				.attr("transform", "translate(0," + heightOfChart + ")")
				.call(xAxisOfChart);
		focus.append("g")
				.attr("class","axis")
				.attr("transform", "translate(" + width + ",0)")
				.call(yAxisOfChart);
				
		
		//Append volume chart here.
		//var barPadding = 0.5;
		volumeChart.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					.attr("class", "volume")
					//The top-left corner of the rectangle is positioned using the x and y attributes, while its size is specified using width and height.
					.attr("x", function(d, i) { 
						return (((d.year - 1999) / 16) * (width2)); 
					}) //need to properly position the rectangle, pixels are too small. 
					.attr("y", function(d) { return (heightOfVolume - yScaleOfVolume(d.volume)); }) //need to properly position the rectangle
					.attr("width", 0.98)
					.attr("height", function(d) { return yScaleOfVolume(d.volume); }); //height seems to be inverted, the smallest bar is at 1999 but appears to be the highest, further testing required. 
		
		volumeChart.append("g")
				.attr("class","axis")
				.attr("transform", "translate(0," + heightOfVolume + ")")
				.call(xAxisOfVolume);
		
		volumeChart.append("g")
				.attr("class","axis")
				.attr("transform", "translate(" + width + ",0)")
				.call(yAxisOfVolume);
		
		
		
        // Generates the brush so that the user can navigate through the data	
		context.append("path")
				  .datum(data)
				  .attr("class", "area")
				  .attr("d", areaOfBrush);

	    context.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + heightOfBrush + ")")
				  .call(xAxisOfBrush);

	    context.append("g")
				  .attr("class", "x brush")
				  .call(brush)
				  .selectAll("rect")
				  .attr("y", -6)
				  .attr("height", heightOfBrush + 7);
		
		
        //Scroll Function		
	    function brushed() {
		  xScaleOfChart.domain(brush.empty() ? xScaleOfBrush.domain() : brush.extent());
		  xScaleOfVolume.domain(brush.empty() ? xScaleOfBrush.domain() : brush.extent());
		  focus.select(".area").attr("d", area); //Targets the area, so that it can be translated.
		  focus.select(".axis").call(xAxisOfChart);
		  volumeChart.select(".axis").call(xAxisOfVolume);		  //Targets the x axis, so that it can be translated.
		}