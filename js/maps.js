var map_w = 1000,
    map_h = 800;

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
      .style("fill", function(d) { return mColor(rateById.get(+d.id)); });
  }
}

function selectAll() {
  updateMap("pct_snap");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-all")
    .classed("active", true);
}

function selectOld() {
  updateMap("pct_old");
  
  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-elderly")
    .classed("active", true);
}

function selectChild() {
  updateMap("pct_child");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-children")
    .classed("active", true);
}

function selectWhite() {
  updateMap("pct_white");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-whites")
    .classed("active", true);
}

function selectBlack() {
  updateMap("pct_black");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-blacks")
    .classed("active", true);
}

function selectAsian() {
  updateMap("pct_asian");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-asians")
    .classed("active", true);
}

function selectHisp() {
  updateMap("pct_hisp");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-hispanics")
    .classed("active", true);
}

function select2Workers() {
  updateMap("pct_2workers");

  d3.selectAll(".btn-secondary")
    .classed("active", false);

  d3.select("#btn-2workers")
    .classed("active", true);
}