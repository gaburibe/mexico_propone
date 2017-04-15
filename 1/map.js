var width = 960,
    height = 628;

var rateById = d3.map();

var quantize = d3.scale.quantize()
  .domain([0, 56])
  .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.conicConformal()
  .rotate([102, 0])
  .center([0, 24])
  .parallels([17.5, 29.5])
  .scale(1850)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

queue()
  .defer(d3.csv, "testimonios.csv", function(d) { rateById.set(d.id, +d.rate); })

 // Legend Stuff

    // var y = d3.scale.sqrt()
    //     .domain([0, 50000])
    //     .range([0,325]);

    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .tickValues(color.domain())
    //     .orient("right");

function updateMap(){
    d3.json("mxst.json", function(error, mx) {
      svg.append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(mx, mx.objects.states).features)
        .enter()
          .append("path")
            .attr("class", function(d) { return "SVGestado" })
            .attr("state_name", function(d) { return d.properties.state_name })
            .attr("state_code", function(d) { return d.properties.state_code })
            .attr("d", path)
          .append("title")
            .text(function(d) { return d.properties.state_name; });

      svg.append("path")
        .datum(topojson.mesh(mx, mx.objects.states, function(a, b) { return a.properties.state_code !== b.properties.state_code; }))
          .attr("class", "state-boundary")     
          .attr("d", path);
    });
}
updateMap();
var myVar = setInterval(myTimer, 1000);

function myTimer() {
    //$('path[state_name="Chihuahua"]').css("fill","blue")
}

d3.select(self.frameElement).style("height", height + "px");