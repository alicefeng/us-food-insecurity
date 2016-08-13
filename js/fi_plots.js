var w_fi = 220,
    h_fi = 220,
    padding_fi = 40;

// create scales
var xScale_fi = d3.scale.linear()
	.domain([1, 10])
	.range([0, w_fi]);

var yScale_fi = d3.scale.linear()
	.domain([1, 10])
	.range([0, h_fi]);

// set up plot
var fi_plot = d3.select("#fi_plot")
  .append("svg")
	.attr("width", w_fi + padding_fi + padding_fi)
	.attr("height", h_fi + padding_fi + padding_fi)
  .append("g")
  	.attr("transform", "translate(" + padding_fi + "," + padding_fi + ")");

d3.csv("data/foodinsecure.csv", function(d) {
	
	return {
		pctateless: d.pctateless,
		pctbalanced: d.pctbalanced,
		pctcutmeals: d.pctcutmeals,
		pctfoodbank: d.pctfoodbank,
		pctfurther: d.pctfurther,
		pcthungry: d.pcthungry,
		pctinsecure: d.pctinsecure,
		pctnoeat: d.pctnoeat,
		pctnofood: d.pctnofood,
		pctnotenough: d.pctnotenough,
		pctrunout: d.pctrunout,
		pctsoupkitchen: d.pctsoupkitchen,
		pctspendmore: d.pctspendmore
	};

}, function(error, data) {
	
	console.log("food insecurity data: ", data);

	// lay out circles
	var circles = fi_plot.selectAll(".ficircle")
		.data(data)
		.enter()
	  .append("circle")
	  	.attr("class", "ficircle")
	  	.attr("cx", function(d, i) { return xScale_fi(i%10) + (w_fi/10/2); })
	  	.attr("cy", function(d, i) { return yScale_fi(Math.floor(i/10) + 1); })
	  	.attr("r", (w_fi/10)/2 - 2)
	  	.style("fill", function(d) { if(d.pctinsecure == 'yes') { return "#D3D3D3"; }
	  								 else { return "#fd9726"; } });

})