// -- SETUP --

// window width and height (from previous DataFace projects)
var windowW = window.innerWidth;
var windowH = window.innerHeight;

// margin setup
var margin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 30
};

// what size screen?
var large_screen = false;
var medium_screen = false;
var small_screen = false;

if (windowW > 1000) {
  large_screen = true;
} else if (windowW > 650) {
  medium_screen = true;
} else {
  small_screen = true;
  margin.left = 10;
  margin.right = 10;
}

// colours
var matc1 = "#fdae95",
  matc2 = "#fa4d16",
  patc1 = "#88cae3",
  patc2 = "#027296",
  matc1rgb = "253, 174, 149",
  patc1rgb = "136, 202, 227";

// -- CHART 1: ARC DIAGRAM --
// showing top ten largest employers in the United States and their parental leave policies

// load data
d3.csv("data/companies-top.csv", function(error, data) {
	if (error) throw error;
	
function arcDiagram() {
  // remove
  d3.selectAll(".arcdiagram > *").remove();

  // setup
  var adW = windowW,
    cH = 150,
    adH = (10 * cH) + cH;

  var sidemargin = 100;
  if (small_screen) sidemargin = 45;
  if (medium_screen) sidemargin = 45;

  adMargin = {
    top: 0,
    right: sidemargin,
    bottom: 0,
    left: sidemargin
  }

  if (large_screen) adW = windowW / 2;

  adW = adW - margin.left - margin.right - adMargin.left - adMargin.right;
  adH = adH - margin.top - margin.bottom;
  var Gtrans = adMargin.left + margin.left

  var adSVG = d3.select(".arcdiagram")
    .attr("width", adW + margin.left + margin.right + adMargin.left + adMargin.right)
    .attr("height", adH + margin.top + margin.bottom),
    adG = adSVG.append("g")
    .attr("transform", "translate(" + Gtrans + "," + margin.top + ")")
  adX = d3.scaleLinear()
    .range([0, adW])
    .domain([0, 52]);

  adSVG.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .style("fill", "black");

  if (large_screen) adSVG.attr("transform", "translate(" + windowW / 4 + ")")

    // set up some basics
    var adr = 3;

    // draw the stuff!
    for (i = 0; i < data.length; i++) {
      var p = cH * (i + 1);

      // draw arcs
      var arcGen = d3.arc();
      drawMarc(data[i].mat_paid, 0, p, "mat", "p")
      drawMarc(data[i].mat_unpaid, data[i].mat_paid, p, "mat", "up")
      drawParc(data[i].pat_paid, 0, p, "pat", "p")
      drawParc(data[i].pat_unpaid, data[i].pat_paid, p, "pat", "up")

      function drawMarc(x2, add, y2, gen, kind) {
        var xTrans = adX(x2) / 2
        if (add > 0) xTrans = adX(x2) / 2 + adX(add)

        var arc = adG.append("path")
          .attr("class", "adarc adarc-" + gen + "-" + kind)
          .attr('transform', 'translate(' + xTrans + ',' + y2 + ')')
          .attr('d', arcGen({
            innerRadius: 0,
            outerRadius: adX(x2) / 2,
            startAngle: -Math.PI * 0.5,
            endAngle: Math.PI * 0.5
          }))

        var arclabel = adG.append("text")
          .attr("class", "adarclabel")
          .attr("x", xTrans)
          .attr("y", function() {
            if (adX(x2) < 50) return y2 - 35
            if (adX(x2) >= 50) return y2 - (adX(x2) / 4)
          })
          .attr("dy", 8)
          .style("text-anchor", "middle")
          .style("fill", function() {
            if (adX(x2) < 50) return "#bfbfbf"
            if (adX(x2) >= 50) return "white"
          })
          .text(function(d) {
            if (kind === "up") return "unpaid"
            if (kind === "p") return "paid"
          })
          .style("display", "none")

        var lengthlabel = adG.append("text")
          .attr("class", "adlengthlabel")
          .attr("x", adX(x2) + adX(add))
          .attr("y", y2)
          .attr("dy", 15)
          .style("text-anchor", "middle")
          .text(function() {
            if (x2 > 0) return x2 + " wks"
          })
          .style("display", "none")

        arc.on("mouseover", function(d) {
            d3.select(this).style("fill", "rgba(" + matc1rgb + ", .9)")
            arclabel.style("display", "block")
            lengthlabel.style("display", "block")
          })
          .on("mouseout", function(d) {
            d3.select(this).style("fill", "rgba(" + matc1rgb + ", .65)")
            if (kind === "up") d3.select(this).style("fill", "rgba(" + matc1rgb + ", .25)")
            arclabel.style("display", "none")
            lengthlabel.style("display", "none")
          })
      }

      function drawParc(x2, add, y2, gen, kind) {
        var xTrans = adX(x2) / 2
        if (add > 0) xTrans = adX(x2) / 2 + adX(add)

        var arc = adG.append("path")
          .attr("class", "adarc adarc-" + gen + "-" + kind)
          .attr('transform', 'translate(' + xTrans + ',' + y2 + ')')
          .attr('d', arcGen({
            innerRadius: 0,
            outerRadius: adX(x2) / 2,
            startAngle: Math.PI * .5,
            endAngle: Math.PI * 1.5
          }))

        var arclabel = adG.append("text")
          .attr("class", "adarclabel")
          .attr("x", xTrans)
          .attr("y", function() {
            if (adX(x2) < 50) return y2 + 35
            if (adX(x2) >= 50) return y2 + (adX(x2) / 4)
          })
          .attr("dy", 2)
          .style("text-anchor", "middle")
          .style("fill", function() {
            if (adX(x2) < 50) return "#bfbfbf"
            if (adX(x2) >= 50) return "white"
          })
          .text(function(d) {
            if (kind === "up") return "unpaid"
            if (kind === "p") return "paid"
          })
          .style("display", "none")

        var lengthlabel = adG.append("text")
          .attr("class", "adlengthlabel")
          .attr("x", adX(x2) + adX(add))
          .attr("y", y2)
          .attr("dy", -7)
          .style("text-anchor", "middle")
          .text(function() {
            if (x2 > 0) return x2 + " wks"
          })
          .style("fill", "#dfdfdf")
          .style("display", "none")

        arc.on("mouseover", function(d) {
            d3.select(this).style("fill", "rgba(" + patc1rgb + ", .9)")
            arclabel.style("display", "block")
            lengthlabel.style("display", "block")
          })
          .on("mouseout", function(d) {
            d3.select(this).style("fill", "rgba(" + patc1rgb + ", .65)")
            if (kind === "up") d3.select(this).style("fill", "rgba(" + patc1rgb + ", .25)")
            arclabel.style("display", "none")
            lengthlabel.style("display", "none")
          })
      }

      // draw baselines
      adG.append("line")
        .attr("class", "adbaseline")
        .attr("x1", adX(0))
        .attr("x2", adX(52))
        .attr("y1", p)
        .attr("y2", p)
        .attr("marker-end", "url(#triangle)");

      // draw nodes
      adG.append("circle").attr("class", "adNode adpat").attr("cy", p).attr("cx", adX(data[i].pat_paid)).attr("r", adr + 1);
      adG.append("circle").attr("class", "adNode adpat").attr("cy", p).attr("cx", adX(data[i].pat_unpaid) + adX(data[i].pat_paid)).attr("r", adr + 1);
      adG.append("circle").attr("class", "adNode admat").attr("cy", p).attr("cx", adX(data[i].mat_paid)).attr("r", adr + 1);
      adG.append("circle").attr("class", "adNode admat").attr("cy", p).attr("cx", adX(data[i].mat_unpaid) + adX(data[i].mat_paid)).attr("r", adr + 1);
      adG.append("circle").attr("class", "adNode adstart").attr("cy", p).attr("cx", adX(0)).attr("r", adr);

      // draw labels
      adG.append("text").attr("class", "axislabel").attr("x", adX(0)).attr("y", p).attr("dx", -7.5).attr("dy", 3).style("text-anchor", "end").text("BIRTH")
      adG.append("text").attr("class", "axislabel").attr("x", adX(52)).attr("y", p).attr("dx", 7.5).attr("dy", 3).style("text-anchor", "start").text("52 WKS")
      adG.append("text").attr("class", "chartTitle").attr("x", 0).attr("dy", -3).attr("y", p - (cH / 2)).style("text-anchor", "start").text(data[i].company)
      adG.append("text").attr("class", "chartTitleh2").attr("x", 0).attr("dy", 10).attr("y", p - (cH / 2)).style("text-anchor", "start").text(data[i].location)
      adG.append("text").attr("class", "chartTitleh2").attr("x", 0).attr("dy", 22).attr("y", p - (cH / 2)).style("text-anchor", "start").text(data[i].employees + " employees")

    } //end drawing stuff

    // annotations, thank you Susie Lu
    const type = d3.annotationLabel
    const adAnnotations = [{
        note: {
          label: "Paid Maternal Leave",
          lineType: "none",
          orientation: "leftRight",
          "align": "middle",
          wrap: 200
        },
        className: "adAnnotation",
        connector: {
          type: "curve",
          points: [
            [20, -10],
            [35, -14]
          ]
        },
        x: adX(13),
        y: 150 - adX(14) / 2,
        dy: -17,
        dx: 74
      },
      {
        note: {
          label: "Unpaid Maternal Leave",
          lineType: "none",
          orientation: "leftRight",
          "align": "middle",
          wrap: 200
        },
        className: "adAnnotation",
        connector: {
          type: "curve",
          points: [
            [20, -10],
            [35, -14]
          ]
        },
        x: adX(25),
        y: 150 - adX(5.5) / 2,
        dy: -17,
        dx: 74
      },
      {
        note: {
          label: "Paid Paternal Leave",
          lineType: "none",
          orientation: "leftRight",
          "align": "middle",
          wrap: 200
        },
        className: "adAnnotation",
        connector: {
          type: "curve",
          points: [
            [20, 10],
            [35, 14]
          ]
        },
        x: adX(5.5),
        y: 150 + adX(5.5) / 2,
        dy: 17,
        dx: 74
      }
    ]

    const sdMakeAnnotations = d3.annotation()
      .type(type)
      .annotations(adAnnotations);

    adG.append("g")
      .attr("class", "annotation-group")
      .call(sdMakeAnnotations);



  
} //end arc diagram
// draw everything
arcDiagram()

// on resize
window.addEventListener('resize', resize)

function resize() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  if (windowW > 1000) {
    large_screen = true;
  } else if (windowW > 650) {
    medium_screen = true;
  } else {
    small_screen = true;
    margin.left = 10;
    margin.right = 10;
  }

  arcDiagram()
}
}) // end load data


