var map_w = 1000,
    map_h = 800;

// set color scale
var mColor = d3.scale.linear()
  .domain([0, 0.07, 0.143, 0.2, 0.25, 0.4])
  .range(["#C2C2C2", "#E1E1E1", "#9ECAE1", "#6BAED6", "#3182BD", "#08519C"]);

// set up map
var cMap = d3.select("#maps_plot")
  .append("svg")
    .attr("width", map_w + padding * 2)
    .attr("height", map_h + padding * 2);

var rateById = d3.map();

var projection = d3.geo.albersUsa()
    .scale(1200)
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

function updateMap(selectedVar) {

  d3.queue()
      .defer(d3.json, "data/us.json")
      .defer(d3.csv, "data/map_data.csv", function(d) { rateById.set(+d.fips, +d[selectedVar]); })
      .await(ready);

  function ready(error, us) {
    
    if (error) throw error;

    var counties = cMap.selectAll(".county")
      .data(topojson.object(us, us.objects.counties).geometries)
      .transition()
      .style("fill", function(d) { return mColor(rateById.get(+d.id)); });
  }
}

function selectAll() {
  updateMap("pct_snap");
}

function selectOld() {
  updateMap("pct_old");
}

function selectChild() {
  updateMap("pct_child");
}

function selectWhite() {
  updateMap("pct_white");
}

function selectBlack() {
  updateMap("pct_black");
}

function selectAsian() {
  updateMap("pct_asian");
}

function selectHisp() {
  updateMap("pct_hisp");
}

function select2Workers() {
  updateMap("pct_2workers");
}