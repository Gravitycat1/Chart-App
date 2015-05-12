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

  var priceData = new Array ();
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

		for (var i = 0; i < data.response.data.length; i++) {
		var fuu = {"volume": data.response.data[i][5], "price": data.response.data[i][1], "date": data.response.data[i][0]}
		priceData.push(fuu)
	
		console.log(priceData)
		
		}
      //console.log(data);
      console.log(data); //price data array with every information

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



function chart() {
	var svg = d3.selectAll('svg').remove();
	
console.log(priceData);

var priceData1 = [{
			"volume": "10",
			"price": "150",
			"date": "1999"
		}, {
			"volume": "20",
			"price": "200",
			"date": "2001"
		}, {
			"volume": "10",
			"price": "150",
			"date": "2002"
		}, {
			"volume": "20",
			"price": "250",
			"date": "2003"
		}, {
			"volume": "10",
			"price": "300",
			"date": "2007"
		}, {
			"volume": "15",
			"price": "250",
			"date": "2010"
		}, {
			"volume": "25",
			"price": "100",
			"date": "2011"
		}, {
			"volume": "35",
			"price": "200",
			"date": "2015"
		}];
	
	console.log(priceData1);
		 

		var marginOfChart = {top: 10, right: 30, bottom: 300, left: 40},
			marginOfBrush = {top: 560, right: 10, bottom: 20, left: 40},
			marginOfVolume =  {top: 430, right: 10, bottom: 50, left: 40},
			width = 960 - marginOfChart.left - marginOfChart.right,
			widthOfVolume = 960 - marginOfVolume.left - marginOfVolume.right,
			heightOfChart = 700 - marginOfChart.top - marginOfChart.bottom,
			heightOfBrush = 640 - marginOfBrush.top - marginOfBrush.bottom,
			heightOfVolume = 600 - marginOfVolume.top - marginOfVolume.bottom;
		
		//Format dates to scalable time
		var parseDate = d3.time.format("%L").parse;
		
		var maxDate = d3.max(priceData, function(d) {
			return d.date;
		});
		 var minDate = d3.min(priceData, function(d) {
			return d.date;
		});
		
		var length = maxDate - minDate;
		//X SCALE//
		
		//x scale for main chart
		var xScaleOfChart = d3.time.scale().range([0, width]).domain([d3.min(priceData, function(d) {
			return (d.date); //needs to be parsed
		}), d3.max(priceData, function(d) {
			return (d.date); //needs to be parsed
		})]);
		
		//x scale for brush
		var xScaleOfBrush = d3.time.scale().range([0, width]).domain([d3.min(priceData, function(d) {
			return (d.date); //needs to be parsed
		}), d3.max(priceData, function(d) {
			return (d.date); //needs to be parsed
		})]);
		
		//x scale for volume
		var xScaleOfVolume = d3.time.scale().range([0, width]).domain([d3.min(priceData, function(d) {
			return (d.date); //needs to be parsed
		}), d3.max(priceData, function(d) {
			return (d.date); //needs to be parsed
		})]);
		
		//Y SCALES//
		 
		//y scale for main chart
		var yScaleOfChart = d3.scale.linear().range([heightOfChart,0]).domain([d3.min(priceData, function(d) {
			return d.price;
		}) - 50, d3.max(priceData, function(d) {
			return d.price;
		})]);
		
		//Add y scale for volume chart
		var yScaleOfVolume = d3.scale.linear().range([heightOfVolume, 0]).domain([0, d3.max(priceData, function(d) {
			return d.volume;
		})]);
		
		//y scale for brush
		var yScaleOfBrush = d3.scale.linear().range([heightOfBrush, 0]).domain([0, d3.max(priceData, function(d) {
			return d.price;
		})]);
		
			
        //Defines the canvas where the chart will be generated		
		var svg = d3.select("body").select(".table-row").append("svg")
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
					return xScaleOfChart((d.date)); //needs to be parsed
				  })
				  .y0(heightOfChart)
				  .y1(function(d) {
					return yScaleOfChart(d.price);
				  })
				  .interpolate("linear");
		
		//Define the bars for the volume chart. I don't think this is relevant any more.
		var volumeBars = d3.svg.line()
					.x(function(d) { return x(d.date); })
					.y(function(d) { return yScaleOfVolume(d.volume); });
		
		var areaOfBrush = d3.svg.area()
				  .x(function(d) {
					return xScaleOfBrush((d.date)); //needs to be parsed
				  })
				  .y0(heightOfBrush)
				  .y1(function(d) {
					return yScaleOfBrush(d.price);
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
		     .datum(priceData)
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
					.data(priceData)
					.enter()
					.append("rect")
					.attr("class", "volume")
					//The top-left corner of the rectangle is positioned using the x and y attributes, while its size is specified using width and height.
					.attr("x", function(d) { 
						return ((((d.date - minDate ) / length) * (widthOfVolume) - 7)); 
					})
					.attr("y", function(d) { 
						return (  yScaleOfVolume(d.volume) ); 
					}) //need to properly position the rectangle
					.attr("width", 0.58)
					.attr("height", function(d) { 
						return heightOfVolume - yScaleOfVolume(d.volume); 
					}); //height seems to be inverted, the smallest bar is at 1999 but appears to be the highest, further testing required. 
		
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
				  .datum(priceData)
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
		var extent = brush.extent();
		  xScaleOfChart.domain(brush.empty() ? xScaleOfBrush.domain() : extent);
		  xScaleOfVolume.domain(brush.empty() ? xScaleOfBrush.domain() :  extent);
		  focus.select(".area").attr("d", area); //Targets the area, so that it can be translated.
		  focus.select(".axis").call(xAxisOfChart);
		  volumeChart.select(".axis").call(xAxisOfVolume);
		  volumeChart.selectAll("rect").attr("x", function(d) { return ((((d.date - minDate) / length) * (widthOfVolume) - 7)); });
		}
		priceData = new Array ();
	};