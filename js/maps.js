var map_w = 800,
    map_h = 600;

// set color scale
var mColor = d3.scale.linear()
  .domain([0, 0.07, 0.143, 0.2, 0.25, 0.4])
  .range(["#C2C2C2", "#E1E1E1", "#9ECAE1", "#6BAED6", "#3182BD", "#08519C"]);


function drawMap() {
  
  // set up map
  var cMap = d3.select("#vis-canvas")
    .append("svg")
      .attr("class", "snapMap")
      .attr("width", map_w)
      .attr("height", map_h);

  var rateById = d3.map();

  var projection = d3.geo.albersUsa()
      .scale(1000)
      .translate([map_w / 2, map_h / 2]);

  var path = d3.geo.path()
      .projection(projection);

  d3.queue()
      .defer(d3.json, "data/us.json")
      .defer(d3.csv, "data/map_data.csv", function(d) { rateById.set(+d.fips, +d.pct_snap); })
      .await(ready);

  function ready(error, us) {
    
    if (error) throw error;

    var counties =  cMap.append("g")
      .attr("class", "counties")
      
    counties.selectAll("path")
        .data(topojson.object(us, us.objects.counties).geometries)
        .enter()
      .append("path")
        .style("fill", function(d) { return mColor(rateById.get(+d.id)); })
        .attr("d", path)
        .attr("class", "county");

    // add state borders
    cMap.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);
  }
}

function updateMap(selectedVar) {

  var rateById = d3.map();

  d3.queue()
      .defer(d3.json, "data/us.json")
      .defer(d3.csv, "data/map_data.csv", function(d) { rateById.set(+d.fips, +d[selectedVar]); })
      .await(ready);

  function ready(error, us) {
    
    if (error) throw error;

    var counties = d3.select(".snapMap").selectAll(".county")
      .data(topojson.object(us, us.objects.counties).geometries)
      .transition()
      .style("fill", function(d) { return rateById.get(+d.id) == "" ? "#111111" : mColor(rateById.get(+d.id)); })
      .style("stroke", function(d) { return rateById.get(+d.id) == "" ? "#eeeeee" : "none"; });
  }
}
