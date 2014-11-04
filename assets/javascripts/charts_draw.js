
function extractKeys(hash) {
  return Object.keys(hash);
}

function extractValues(hash) {
  var keys = extractKeys(hash);
  return keys.map(function(v) { return hash[v]; });
}

function request(url,cb) {
  $.ajax({
    url: url
  }).done(cb)
}

function draw(id, lineChartData) {
  console.dir(lineChartData);
  var ctx = document.getElementById(id).getContext("2d");
  return new Chart(ctx).Line(lineChartData, {
    responsive: true,
    
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span class=\"bullet-item\" style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    
  });

}

var rand = function(){ return Math.round(Math.random()*254)};
var randrgb = function(){
  var r1 =rand();

  var r2 = rand();
  if (r1 > 200 && r2 > 200) {
    r2 = 100;
  }
  var r3 = rand();
  if (r1 > 200 && r2 > 200) {
    r2 = r3-100;
  }
  return r1+","+r2+","+r3;
}
function buildData(rcvData) {
  var keys = rcvData.keys;
  var values = rcvData.values;
  var fin = values.map(function(v){
    var vals = extractValues(v.values);
    var rgb = randrgb();

    return {
      label: v.project,
      fillColor : "rgba("+rgb+",0.2)",
      strokeColor : "rgba("+rgb+",1)",
      pointColor : "rgba("+rgb+",1)",
      pointStrokeColor : "#ccc",
      pointHighlightFill : "#ccc",
      pointHighlightStroke : "rgba("+rgb+",1)",
      data: vals
    }

  });
  return {
    labels: keys,
    datasets: fin
  };
}
function getUrl(project,overview) {
  var baseUrl = '/tsv/'+overview;
  var url;
  if(project === undefined) {
    url = baseUrl;
  } else if(project instanceof Array){
  } else{
    url = baseUrl + '?p[]=' + project;
  }
  return url;
}

function drawLastWeek(project) {
  var url = getUrl(project, "new_per_day");
  request(url, function(data){
    var lineData = buildData(data);
    window.weeklyCanvas = draw("weekly-overview", lineData);
    drawLegend(weeklyCanvas,"#last-7-days-legend");
  });
}
function drawLegend(canvas,id) {
  legend = canvas.generateLegend();
  lemento = $(id);
  lemento.empty();
  lemento.append(legend);
}

function drawUserHoursLastMonth(user) {
  var url = getUrl(user, "user_hours");
  request(url, function(data){
    var lineData = buildData(data);
    window.userCanvas = draw("user-hours", lineData);
    drawLegend(userCanvas, "#user-last-month-legend");
  });

}

function drawLastMonth(project) {
  // url: http://127.0.0.1:3000/tsv/new_per_day
  var url = getUrl(project, "overview_yearly");
  request(url, function(data){
    var lineData = buildData(data);
    window.monthlyCanvas = draw("monthly-overview", lineData);
    drawLegend(monthlyCanvas, "#last-30-days-legend");
  });
}
function drawSearchLines() {
  $(".proj-select").prepend("<option selected>Select to compare...</option>");
}

$(".proj-select").change(function(e){
  prnt = $(this).closest(".graph");
  console.log(prnt);
  name = "draw" + prnt.attr("id");
  console.log(name);
  window[name](e.target.value);
});

$( document ).ready(function() {
  drawSearchLines();
  drawLastWeek();
  drawLastMonth();
  drawUserHoursLastMonth();
});

