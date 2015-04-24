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
		var margin = {top: 10, right: 30, bottom: 300, left: 40},
			margin2 = {top: 560, right: 10, bottom: 20, left: 40},
			margin3 =  {top: 430, right: 10, bottom: 50, left: 40},
			width = 960 - margin.left - margin.right,
			height = 700 - margin.top - margin.bottom,
			height2 = 640 - margin2.top - margin2.bottom,
			height3 = 600 - margin3.top - margin3.bottom;
		
		//Format years to scalable time
		var parseDate = d3.time.format("%Y").parse;
		
		//X SCALE//
		
		//x scale for main chart
		var xScale = d3.time.scale().range([width, 0]).domain([d3.min(data, function(d) {
			return parseDate(d.year);
		}), d3.max(data, function(d) {
			return parseDate(d.year);
		})]);
		
		//x scale for navigator
		var x2Scale = d3.time.scale().range([width, 0]).domain([d3.min(data, function(d) {
			return parseDate(d.year);
		}), d3.max(data, function(d) {
			return parseDate(d.year);
		})]);
		
		//Y SCALES//
		 
		//y scale for main chart
		var yScale = d3.scale.linear().range([height,0]).domain([0, d3.max(data, function(d) {
			return d.sale;
		})]);
		
		//Add y scale for volume chart
		var y3Scale = d3.scale.linear().range([height3, 0]).domain([d3.max(data, function(d) {
			return d.volume;
		}), d3.min(data, function(d) {
			return d.volume;
		})]);
		
		//y scale for navigator
		var y2Scale = d3.scale.linear().range([height2, 0]).domain([0, d3.max(data, function(d) {
			return d.sale;
		})]);
		
		//Axes
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom").innerTickSize(-height).outerTickSize(0).tickPadding(5); //move innerTickSize and onwards further down to prevent overlapping
		var xAxis2 = d3.svg.axis().scale(x2Scale).orient("bottom"); //x2Scale switched to xScale
		var yAxis = d3.svg.axis().scale(yScale).orient("right").innerTickSize(-width).outerTickSize(0).tickPadding(5); //move innerTickSize and onwards further down to prevent overlapping
		var yAxis2 = d3.svg.axis().scale(y3Scale).orient("right").tickFormat(d3.format("0s")).ticks(5).innerTickSize(-width).outerTickSize(0).tickPadding(5);; //Y Axis for the volume chart and move innerTickSize and onwards further down to prevent overlapping
		
		
		
		//Defines the brush.
		var brush = d3.svg.brush()
							.x(x2Scale) //x2Scale was switched to xScale
							.on("brush", brushed);
							
		var area = d3.svg.area()
				  .x(function(d) {
					return xScale(parseDate(d.year));
				  })
				  .y0(height)
				  .y1(function(d) {
					return yScale(d.sale);
				  })
				  .interpolate("linear");
		
		//Define the bars for the volume chart.
		var volumeBars = d3.svg.line()
					.x(function(d) { return x(d.year); })
					.y(function(d) { return y3Scale(d.volume); });
		
		var area2 = d3.svg.area()
				  .x(function(d) {
					return x2Scale(parseDate(d.year)); //Switched x2Scale to xScale
				  })
				  .y0(height2)
				  .y1(function(d) {
					return y2Scale(d.sale);
				  })
				  .interpolate("linear");
		
        //Defines the canvas where the chart will be generated		
		var svg = d3.select("body").append("svg")
									.attr("width", width + margin.left + margin.right)
									.attr("height", height + margin.top + margin.bottom);
		
		//Assures that the area of the chart remains within the axes, not the canvas.							
		svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", width)
			.attr("height", height);
			
		//Defines the chart.	
		var focus = svg.append("g")
			.attr("class", "focus")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		//Define the bar chart.
		var volumeChart = svg.append("g")
			.attr("class", "volumeChart")
			.attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");
		
        //Defines the navigator
		var context = svg.append("g")
			.attr("class", "context")
			.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
		
		//Generates the actual chart.
		focus.append('path')
		     .datum(data)
		     .attr("class", "area")
		     .attr('d', area);		  
		focus.append("g")
				.attr("class","axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);
		focus.append("g")
				.attr("class","axis")
				.attr("transform", "translate(" + width + ",0)")
				.call(yAxis);
		
		//Append volume chart here.
		var barPadding = 0.5;
		volumeChart.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					.attr("class", "volume")
					.attr("y", function(d, i) { return height3 - d.volume; }) //needs to be adjusted to match the graph
					.attr("x", function(d, i) { return i * (127); }) //set up so that the spacing scales with the width
					.attr("width", 3)
					.attr("height", function(d, i) { return d.volume; }); //needs to be adjusted to match the graph
		
		volumeChart.append("g")
				.attr("class","axis")
				.attr("transform", "translate(" + width + ",0)")
				.call(yAxis2);
		
        // Generates the navigator so that the user can navigate through the data	
		context.append("path")
				  .datum(data)
				  .attr("class", "area")
				  .attr("d", area2);

	    context.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + height2 + ")")
				  .call(xAxis2);

	    context.append("g")
				  .attr("class", "x brush")
				  .call(brush)
				  .selectAll("rect")
				  .attr("y", -6)
				  .attr("height", height2 + 7);
		
        //Scroll Function		
	    function brushed() {
		  xScale.domain(brush.empty() ? x2Scale.domain() : brush.extent()); //switched x2Scale to xScale
		  focus.select(".area").attr("d", area); //Targets the area, so that it can be translated.
		  focus.select(".axis").call(xAxis); //Targets the x axis, so that it can be translated.
		}