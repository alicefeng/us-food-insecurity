function drawSnapTs() {
	var w = 600,
	    h = 400,
	    padding = 60;

	// create scales
	xScale = d3.time.scale()
		.range([0, w]);

	yScale = d3.scale.linear()
		.rangeRound([h, 0]);

	// set up axes
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.tickFormat(d3.format("%"));

	// set up function to draw the line
	var line = d3.svg.line()
		.x(function(d) { return xScale(d.Year); })
		.y(function(d) { return yScale(d.Ratio); })
		.interpolate("linear");

	var tsPlot = d3.select("#vis-canvas")
	  .append("svg")
		.attr("width", w + padding + padding)
		.attr("height", h + padding + padding)
	  .append("g")
		.attr("transform", "translate(" + padding + "," + padding + ")");


	d3.csv("data/snap_partic_series.csv", function(d) {

		return {
			Year: d3.time.format("%Y").parse(d.Year),
			Ratio: +d.Ratio,
			Recession: d.Recession
		};

	}, function(error, data) {

		console.log(data);

		// set scale domains
		xScale.domain([d3.min(data, function(d) { return d.Year; }), d3.max(data, function(d) { return d.Year; }) ]);

		yScale.domain([0, d3.max(data, function(d) { return d.Ratio; }) ]);

		// draw axes
		tsPlot.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);

		tsPlot.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		// shade in recession years
		tsPlot.selectAll("rect")
			.data(data)
			.enter()
		  .append("rect")
		  	.attr("class", "recession")
		  	.attr("x", function(d) { return xScale(d.Year); })
		  	.attr("y", 0)
		  	.attr("width", xScale(new Date(2016, 1, 1)) - xScale(new Date(2015, 1, 2)) + 1)  // width of one year
		  	.attr("height", h - 1)
		  	.style("fill", function(d) { return d.Recession == 'Yes' ? '#444' : 'none'; });

		// draw line for percentage of US population receiving SNAP
		tsPlot.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);

		// label shaded areas as being recessions
		tsPlot.append("text")
			.attr("x", xScale(new Date(1973, 2, 1)))
			.attr("y", 15)
			.text("Recession")
			.style("font-style", "italic");

	}); 
}