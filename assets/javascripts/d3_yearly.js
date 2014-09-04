var margin = {top: 20, right: 20, bottom: 30, left: 50},
    widthMONTH = $('.kpi-tickets-last-month').parent().width() - margin.right - margin.left,
    heightMONTH = 300 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;
var xMONTH = d3.time.scale()
  .range([0,widthMONTH]);

var yMONTH = d3.scale.linear()
  .range([heightMONTH, 0]);

var xAxisM = d3.svg.axis()
  .scale(xMONTH)
  .orient("bottom");

var yAxisM = d3.svg.axis()
  .scale(yMONTH)
  .orient("left");

var line = d3.svg.line()
  .x(function(d){ return xMONTH(d.name); })
  .y(function(d){ return yMONTH(d.value); });
  
var svgM = d3.select('.kpi-tickets-last-month')
  .attr("width", widthMONTH + margin.left + margin.right)
  .attr("height", heightMONTH + margin.bottom + margin.top)
.append("g")
  .attr("transform", "translate("+margin.left+","+margin.top+")");

d3.tsv("tsv?for=overview_yearly", function(error, data) {
  data.forEach(function(d){
    d.name = parseDate(d.name);
    d.value = +d.value;
  });
  xMONTH.domain(d3.extent(data, function(d) { return d.name; }));
  yMONTH.domain(d3.extent(data, function(d) { return d.value; }));

  svgM.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxisM);

  svgM.append("g")
    .attr("class", "y axis")
    .call(yAxisM);

  svgM.append("svg:line")
   .attr("x1", 0)
    .attr("y1", heightMONTH/2)
    .attr("x2", widthMONTH)
    .attr("y2", heightMONTH/2)
    .attr('stroke-width', 2)
    .style("stroke", "rgb(255,0,0)");

  svgM.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)


});
