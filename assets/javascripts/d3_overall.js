var margin = {top: 20, right: 20, bottom: 30, left: 50},
    widthOVERALL = $('.kpi-tickets-last-month').parent().width() - margin.right - margin.left,
    heightOVERALL = 300 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;
var xOVERALL = d3.time.scale()
  .range([0,widthOVERALL]);

var yOVERALL = d3.scale.linear()
  .range([heightOVERALL, 0]);

var xAxisO = d3.svg.axis()
  .scale(xOVERALL)
  .orient("bottom");

var yAxisO = d3.svg.axis()
  .scale(yOVERALL)
  .orient("left");

var lineO = d3.svg.line()
  .x(function(d){ return xOVERALL(d.name); })
  .y(function(d){ return yOVERALL(d.value); });
  
var lineX = d3.svg.line()
  .x(function(d){ return xOVERALL(d.name); })
  .y(function(d){ console.log(d); return 5.0; });
var svgO = d3.select('.kpi-tickets-overall')
  .attr("width", widthOVERALL + margin.left + margin.right)
  .attr("height", heightOVERALL + margin.bottom + margin.top)
.append("g")
  .attr("transform", "translate("+margin.left+","+margin.top+")");

d3.tsv("tsv?for=overview_overall", function(error, data) {
  data.forEach(function(d){
    d.name = parseDate(d.name);
    d.value = +d.value;
  });
  xOVERALL.domain(d3.extent(data, function(d) { return d.name; }));
  yOVERALL.domain(d3.extent(data, function(d) { return d.value; }));

  svgO.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxisO);

  svgO.append("g")
    .attr("class", "y axis")
    .call(yAxisO);



  svgO.append("path")
    .datum(data)
    .attr("color", "red")
    .attr("class", "line")
    .attr("d", lineO)
    .attr("stroke", function(d){return "green"});
});
