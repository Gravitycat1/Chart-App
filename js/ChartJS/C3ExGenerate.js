// Example data
var data = [
    {
        name: "Series1",
        data: ohlcData
    },
    {
        name: "Series2",
        data: ohlcData
    }
];

var ohlcData = [
    {
        date:  new Date(2014,8,25),
        open:  120,
        high:  121,
        low:   119,
        close: 120.5
    },
    {
        date:  new Date(2014,8,26),
        open:  121,
        high:  122,
        low:   119,
        close: 120
    }
];
sl.series.comparison = function () {

    // Set Default scales
    var xScale = d3.time.scale(),
        yScale = d3.scale.linear();

    var percentageChange = function (seriesData, initialDate) {
    // Compute the percentage change data of a series from an initial date.
    };

    var calculateYDomain = function (data, xDomain) {
    // Compute the y domain given the percentage change data of every series. 
    };

    var color = d3.scale.category10();

    var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) {
            return xScale(d.date);
        })
        .y(function (d) {
            return yScale(d.change);
        });

    var comparison = function (selection) {
        // Create/update the series.
        var series, lines;

        selection.each(function (data) {

            data = data.map(function (d) {
                return {
                    name: d.name,
                    data: percentageChange(d.data, xScale.domain()[0])
                };
            });

            color.domain(data.map(function (d) {
                return d.name;
            }));

            yScale.domain(calculateYDomain(data, xScale.domain()));

            series = d3.select(this).selectAll('.comparison-series').data([data]);
            series.enter().append('g').classed('comparison-series', true);

            lines = series.selectAll('.line')
                .data(data, function(d) {
                    return d.name;
                })
                .enter().append("path")
                .attr("class", "line")
                .attr("d", function (d) {
                    return line(d.data);
                })
                .style("stroke", function (d) {
                    return color(d.name);
                });

            series.selectAll('.line')
                .attr("d", function (d) {
                    return line(d.data);
                });
        });
    };

    comparison.xScale = function (value) {
    // xScale getter/setter
    };

    comparison.yScale = function (value) {
    // yScale getter/setter
    };

    return comparison;
};
sl.svg.gridlines = function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xTicks = 10,
        yTicks = 10;

    var xLines = function (data, grid) {
        var xlines = grid.selectAll('.x')
            .data(data);
        xlines
            .enter().append('line')
            .attr({
                'class': 'x',
                'x1': function(d) { return xScale(d);},
                'x2': function(d) { return xScale(d);},
                'y1': yScale.range()[0],
                'y2': yScale.range()[1]
            });
        xlines
            .attr({
                'x1': function(d) { return xScale(d);},
                'x2': function(d) { return xScale(d);},
                'y1': yScale.range()[0],
                'y2': yScale.range()[1]
            });
        xlines.exit().remove();
    };

    var yLines = function (data, grid) {
       // Similar to xLines.
    };

    var gridlines = function (selection) {
        var grid, xTickData, yTickData;

        selection.each(function () {
            xTickData = xScale.ticks(xTicks);
            yTickData = yScale.ticks(yTicks);

            grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
            grid.enter().append('g').classed('gridlines', true);
            xLines(xTickData, grid);
            yLines(yTickData, grid);
        });
    };

    gridlines.xScale = function (value) {
    // xScale getter/setter
    };

    gridlines.yScale = function (value) {
    // yScale getter/setter
    };

    gridlines.xTicks = function (value) {
    // Get/set number of xTicks
    };

    gridlines.yTicks = function (value) {
    // Get/set number of yTicks
    };

    return gridlines;
};
var series = sl.series.comparison()
    .xScale(xScale)
    .yScale(yScale);

var gridlines = sl.svg.gridlines()
    .xScale(xScale)
    .yScale(yScale)
    .xTicks(10)
    .yTicks(5);
// Draw gridlines
plotArea
    .call(gridlines);

// Draw series.
plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(series);
