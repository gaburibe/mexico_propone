function donut(contenedor){
  console.log("DONUTR")
	var width = 230,
    height = 290,
    radius = 120;
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    svg.selectAll(".centertext")
        .text( Math.round(d.data.population*100/15)+"%" )
    return "<strong>"+d.data.age+"</strong>";
  })
var color = d3.scale.ordinal()
    .range(["#0ce8a9", "#0dcc91", "#0caa75", "#0d8459", "#08442a", "#000", "#fff"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("#"+contenedor).append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    svg.append("text")
      .attr("dy", ".35em")
      .attr("class","centertext")
      .text(function(d) { return "100%" });
svg.call(tip);
d3.csv("data/res.csv", type, function(error, data) {
  if (error) throw error;

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
      .on('mouseover', function(d){
        //alert(d.data.age);
        
      })
      .on('mouseover',tip.show)
      .on('mouseout', tip.hide);

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.age); });

  // g.append("text")
  //     .attr("x", function(d) { return 0 })
  //     .attr("y", function(d) { return 0 })
  //     .text(function(d) { return "Título" });
  
});
}


function type(d) {
  d.population = +d.population;
  return d;
}