//sample data
var data = [{
			"sale": "202",
			"year": "1999",
			"volume": "60"
		}, {
			"sale": "215",
			"year": "2001",
			"volume": "30"
		}, {
			"sale": "179",
			"year": "2002",
			"volume": "100"
		}, {
			"sale": "199",
			"year": "2003",
			"volume": "150"
		}, {
			"sale": "134",
			"year": "2005",
			"volume": "135"
		}, {
			"sale": "176",
			"year": "2010",
			"volume": "195"
		}, {
			"sale": "200",
			"year": "2011",
			"volume": "205"
		}, {
			"sale": "301",
			"year": "2012",
			"volume": "155"
		}];
		//add sample volume data
		
        // Add height and margins for the volume chart (added margins and height for the volume chart.)	
		var marginOfChart = {top: 10, right: 30, bottom: 300, left: 40},
			marginOfBrush = {top: 560, right: 10, bottom: 20, left: 40},
			marginOfVolume =  {top: 430, right: 10, bottom: 50, left: 40},
			width = 960 - marginOfChart.left - marginOfChart.right,
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
		
		//Y SCALES//
		 
		//y scale for main chart
		var yScaleOfChart = d3.scale.linear().range([heightOfChart,0]).domain([0, d3.max(data, function(d) {
			return d.sale;
		})]);
		
		//Add y scale for volume chart
		var yScaleOfVolume = d3.scale.linear().range([heightOfVolume, 0]).domain([d3.max(data, function(d) {
			return d.volume;
		}), d3.min(data, function(d) {
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
		var xAxisOfChart = d3.svg.axis().scale(xScaleOfChart).orient("bottom"); //move innerTickSize and onwards further down to prevent overlapping
		var xAxisOfBrush = d3.svg.axis().scale(xScaleOfBrush).orient("bottom"); 
		var yAxisOfChart = d3.svg.axis().scale(yScaleOfChart).orient("right"); //move innerTickSize and onwards further down to prevent overlapping
		var yAxisOfVolume = d3.svg.axis().scale(yScaleOfVolume).orient("right").tickFormat(d3.format("0s")).ticks(5); //Y Axis for the volume chart and move innerTickSize and onwards further down to prevent overlapping
		

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
		var barPadding = 0.5;
		volumeChart.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					.attr("class", "volume")
					.attr("y", function(d, i) { return heightOfVolume - d.volume; }) //needs to be adjusted to match the graph
					.attr("x", function(d, i) { return i * (127); }) //set up so that the spacing scales with the width
					.attr("width", 3)
					.attr("height", function(d, i) { return d.volume; }); //needs to be adjusted to match the graph
		
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
		  focus.select(".area").attr("d", area); //Targets the area, so that it can be translated.
		  focus.select(".axis").call(xAxisOfChart); //Targets the x axis, so that it can be translated.
		}