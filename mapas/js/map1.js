 
function clicked(d) {
  
  var x, y, k;
  console.log("wot?");
  if (d && centered !== d) {
    console.log("clicked");
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 5;
    centered = d;
  } else {
    console.log("clicked-null");
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


var width = 660,
    height = 628,
    centered;

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
    svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);
var g = svg.append("g");

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
 
  g.append("g")
      .attr("class", "municipalities")
    .selectAll("path")
      .data(topojson.feature(mx, mx.objects.municipalities).features)
    .enter().append("path")
      .attr("d", path)
      .on("click", clicked)
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

  g.append("path")
      .datum(topojson.mesh(mx, mx.objects.municipalities, function(a, b) { return a.properties.state !== b.properties.state; }))
      .attr("class", "state-boundary")
      .attr("d", path);

  g.append("path")
      .datum(topojson.mesh(mx, mx.objects.municipalities, function(a, b) { return a.properties.state === b.properties.state && a !== b; }))
      .attr("class", "municipality-boundary")
      .attr("d", path);
      donut(); // call donut
});

d3.select(self.frameElement).style("height", height + "px");