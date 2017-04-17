 active = d3.select(null);
 var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
function zoomed() {
  svg.style("stroke-width", 1.5 / d3.event.scale + "px");
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
function clicked(d) {
  console.log("clicked");
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);
}
function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);
}

var width = 660,
    height = 628;

var projection = d3.geo.conicConformal()
    .rotate([102, 0])
    .center([0, 24])
    .parallels([17.5, 29.5])
    .scale(1550)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("mx.json", function(error, mx) {
  submap=[];
  mm=topojson.feature(mx, mx.objects.municipalities).features;
   console.log("check",mm);
  //submap.objects=mx.objects;
  if (error) throw error;
  for(munnum in mm){
    municipio=mm[munnum];
    //console.log(munnum);
    if (municipio.properties.name !="Parras") {
      //delete mx.objects.municipalities.geometries[munnum];
      //submap
    }
    else{
      submap[munnum]=mm[munnum];
    }
    

  }
  
  console.log("original",mx.objects.municipalities);
  console.log("copia",submap)
 
  svg.append("g")
      .attr("class", "municipalities")
      .on("click", clicked)
    .selectAll("path")
      .data(topojson.feature(mx, mx.objects.municipalities).features)
    .enter().append("path")
      .attr("d", path)
    .append("title")
    
      .text(function(d) { 
        if (d) {
          //console.log(d)
          return d.properties.name; 
        }
        else{
          return "";
        }
       
   });

  svg.append("path")
      .datum(topojson.mesh(mx, mx.objects.municipalities, function(a, b) { return a.properties.state !== b.properties.state; }))
      .attr("class", "state-boundary")
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(mx, mx.objects.municipalities, function(a, b) { return a.properties.state === b.properties.state && a !== b; }))
      .attr("class", "municipality-boundary")
      .attr("d", path);
      donut(); // call donut
});

d3.select(self.frameElement).style("height", height + "px");