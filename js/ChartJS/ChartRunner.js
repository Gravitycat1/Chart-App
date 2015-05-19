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

  var dataArray = new Array();
  var dataArray1 = new Array();
  var i = 0;
  var count = 0;
  var skipper = 15;
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
		
//If 1 day skipper is 1
//If 5 days skipper is 1
//If 1 month skipper is 1
//If 2 months skipper is 1
//If 6 months skipper is 1
//If YTD (beginning of the year to today) skipper is 1
//If 1 year skipper is 5
//If 5 years skipper is 5
//If 10 years skipper is 15?
//If all skipper is 30
		
console.log(data.response.data)
		for (var i = 0; i < data.response.data.length; i = i + skipper) {
		var fuu = {"volume": data.response.data[i][5], "price": data.response.data[i][1], "date": data.response.data[i][0]}
		dataArray.push(fuu)
		console.log(dataArray)
		}
		
	   console.log("Done! Retrieval Finished.")
	   Runner.Chart(dataArray)
	   
	}, function(jqXHR){

		throw new Error('Failed to load data!',jqXHR);
	}).then(function(){
		checks ++;
		if(checks === 2){
			Runner.toggleOverhead();
		}
	});

	return AppData;
	flag = 1;
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



Runner.Chart = function Chart(priceData) {
	
	var svg = d3.selectAll('svg').remove();
	
        console.log(priceData);
		console.log("Data transfer to function above. This array is the priceData array.");


		var marginOfChart = {top: 10, right: 50, bottom: 300, left: 50},
			marginOfBrush = {top: 560, right: 50, bottom: 20, left: 50},
			marginOfVolume =  {top: 430, right: 50, bottom: 50, left: 50},
			width = 980 - marginOfChart.left - marginOfChart.right,
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
			return (d.date); 
		}), d3.max(priceData, function(d) {
			return (d.date); 
		})]);
	
		//x scale for brush
		var xScaleOfBrush = d3.time.scale().range([0, width]).domain([d3.min(priceData, function(d) {
			return (d.date); 
		}), d3.max(priceData, function(d) {
			return (d.date); 
		})]);
		
		//x scale for volume
		var xScaleOfVolume = d3.time.scale().range([0, width]).domain([d3.min(priceData, function(d) {
			return (d.date); 
		}), d3.max(priceData, function(d) {
			return (d.date); 
		})]);
		
		var xScaleOfVolumeBars = d3.time.scale().range([0, width]).domain([d3.min(priceData, function(d) {
			return (d.date); 
		}), d3.max(priceData, function(d) {
			return (d.date); 
		})]);
		
		//Y SCALES//
		 
		//y scale for main chart
		var yScaleOfChart = d3.scale.linear().range([heightOfChart,0]).domain([d3.min(priceData, function(d) {
			return d.price;
		}) - 5, d3.max(priceData, function(d) {
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
        var svgTooltip = d3.select("body").select("#table-row").select("#tooltip").append("svg")
                                     .attr("width", 250)
                                     .attr("height", 25);

        var svgLegend = d3.select("body").select("#table-row").select("#legend").append("svg")
                                     .attr("width", 250)
                                     .attr("height", 25);	
		
		var legend = svgLegend.append("rect")
                           .attr("x", 0)
                           .attr("y", 0)
                           .attr("width", 250)
                           .attr("height", 25)
						   .attr("class", "legend");

        var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) { return '<span>' + d.volume.toFixed(2) + '</span>' + ' dollar value of stock at ' 
		+ '<span>' + d.price + '</span>' + ' dollars per share.' })
        .offset([-12, 0]);

									 
		var svg = d3.select("body").select("#table-row").select("#chart").append("svg")
									.attr("width", width + marginOfChart.left + marginOfChart.right)
									.attr("height", heightOfChart + marginOfChart.top + marginOfChart.bottom);
		
		//Axes
		var xAxisOfChart = d3.svg.axis().scale(xScaleOfChart).orient("bottom");
		var xAxisOfBrush = d3.svg.axis().scale(xScaleOfBrush).orient("bottom");
		var xAxisOfVolume = d3.svg.axis().scale(xScaleOfVolume).orient("bottom"); 
		var yAxisOfChart = d3.svg.axis().scale(yScaleOfChart).orient("right");
		var yAxisOfVolume = d3.svg.axis().scale(yScaleOfVolume).orient("right").tickFormat(d3.format("0s")).ticks(5);
		
		var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);

		var bisectDate = d3.bisector(function(d) { return d.date; }).left;

		var x = d3.time.scale()
			.range([0, width]);

		function mouseover() { //functions
		  div.transition()
			  .duration(500)
			  .style("opacity", 1);
		}

		function mousemove() {
		  div
			  .text(d3.event.pageX + ", " + d3.event.pageY)
			  .style("left", (d3.event.pageX - 34) + "px")
			  .style("top", (d3.event.pageY - 12) + "px");
		}

		function mouseout() {
		  div.transition()
			  .duration(500)
			  .style("opacity", 1e-6);
		}


		//Defines the brush.
		var brush = d3.svg.brush()
							.x(xScaleOfBrush) 
							.on("brush", brushed);
							
		var area = d3.svg.area()
				  .x(function(d) {
					return xScaleOfChart((d.date)); 
				  })
				  .y0(heightOfChart)
				  .y1(function(d) {
					return yScaleOfChart(d.price);
				  })
				  .interpolate("linear");
		
		var areaOfBrush = d3.svg.area()
				  .x(function(d) {
					return xScaleOfBrush((d.date)); 
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
		
		var volumeBars = volumeChart.append("g");
		volumeBars.attr("clip-path", "url(#clip)");

		 volumeBars.call(tip) //modify for our chart. have to get this working!
        var legend = svgLegend.append('rect')
        .attr('width', 250) // have to add the tooltip and mouseover commands.
        .attr('height', 1)
        .attr('x', 0) //assumed that this is positioning
        .attr('y', 20)
        .attr('class', 'legend'); //assign class

		
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
		     .attr('d', area)		  
		     .on("mouseover", mouseover)
   		     .on("mousemove", mousemove)
    	     .on("mouseout", mouseout);
		focus.append("g")
				.attr("class","axis")
				.attr("transform", "translate(0," + heightOfChart + ")")
				.call(xAxisOfChart);
		focus.append("g")
				.attr("class","axis")
				.attr("transform", "translate(" + width + ",0)")
				.call(yAxisOfChart)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", "2.3em")
				  .style("text-anchor", "end")
				  .text("Price ($)");
				
		
		//Append volume chart here.
		//var barPadding = 0.5;
		volumeBars.selectAll(".volume")
					.data(priceData)
					.enter()
					.append("rect")
					.attr("class", "volume")
					//The top-left corner of the rectangle is positioned using the x and y attributes, while its size is specified using width and height.
					.attr("x", function(d) { 
						return xScaleOfVolumeBars(d.date)  //temporary, testing applicability 
					})
					.attr("y", function(d) { 
						return (  yScaleOfVolume(d.volume) ); 
					}) //need to properly position the rectangle
					.attr("width", 1)
					.attr("height", function(d) { 
						return heightOfVolume - yScaleOfVolume(d.volume); 
					}) //height seems to be inverted, the smallest bar is at 1999 but appears to be the highest, further testing required. 
		.on('mouseout', tip.hide)
                    .on('mouseover', function(d) { // <--- this function is important, so is the one above! this will show the tooltip.
                      tip.show(d, legend.node())
                                          });
		volumeChart.append("g")
				.attr("class","axis")
				.attr("transform", "translate(" + width + ",0)")
				.call(yAxisOfVolume)
				.append("text")
				  .attr("transform", "rotate(-90)")
				  .attr("y", 6)
				  .attr("dy", "2.6em")
				  .style("text-anchor", "end")
				  .text("Volume");
		
		
		
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
		
		//Clear data array for next use.
		dataArray = new Array();
		
		
        //Scroll Function		
	    function brushed() {
		var extent = brush.extent();
		//var rangeExtent = [xScaleOfBrush( extent[0] ), xScaleOfBrush( extent[1] ) ]; //convert
		//var rangeWidth  = rangeExtent[1] - rangeExtent[0];
		  xScaleOfChart.domain(brush.empty() ? xScaleOfBrush.domain() : extent); 
		  xScaleOfVolume.domain(brush.empty() ? xScaleOfBrush.domain() :  extent);
		  xScaleOfVolumeBars.domain(brush.empty() ? xScaleOfBrush.domain() :  extent); 
		  focus.select(".area").attr("d", area); //Targets the area, so that it can be translated.
		  focus.select(".axis").call(xAxisOfChart);
		  volumeBars.selectAll(".volume").attr("x", 
		  function(d) { return xScaleOfVolumeBars(d.date) });
		
	};
	
	
}	