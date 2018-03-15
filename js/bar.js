// -- SETUP --

// window width and height (from previous DataFace projects)
var windowW = window.innerWidth;
var windowH = window.innerHeight;

// barMargin setup
var barMargin = {
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
} else if (windowW > 763) {
  medium_screen = true;
} else {
  small_screen = true;
}

// colours
var matc1 = "#fdae95",
  matc2 = "#fa4d16",
  patc1 = "#88cae3",
  patc2 = "#027296",
  matc1rgb = "253, 174, 149",
  patc1rgb = "136, 202, 227";

// -- BAR CHART --
// showing how the US compares to other countries around the world

// load the data
d3.csv("data/countries.csv", function(error, data) {
	if (error) throw error;

function barChart() {
  // remove
  d3.selectAll(".barchart > *").remove();

  var barW, 
  	  barH = 1000;
  // setup
  if (windowW > 1300) {
	  barW = 1300;
	  barMargin.left = (windowW - 1300) / 2;
	  barMargin.right = 0;
  } else {
	  barMargin.right = 10;
	  barMargin.left = 10;
	  barW = windowW - 15;
  }

  barW = barW - barMargin.left - barMargin.right;
  barH = barH - barMargin.top - barMargin.bottom;
	
  var barSVG = d3.select(".barchart")
    .attr("width", barW + barMargin.left + barMargin.right)
    .attr("height", barH + barMargin.top + barMargin.bottom),
    barG = barSVG.append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")")
  barX = d3.scaleLinear()
    .range([100, barW]),
    barY = d3.scaleBand()
    .rangeRound([barH, 0])
    .padding(0.2)

  formatPercent = d3.format("%");

  // set up axes
  var barXaxis = d3.axisBottom(barX)
    .ticks(10, ".0s")
    .tickSizeOuter(0)
    .tickFormat(function(d) {
      return Math.abs(d) + " wks"
    }),
    barYaxis = d3.axisLeft(barY).tickSize(0),
    barCm = d3.scaleLinear().interpolate(d3.interpolateHcl)
    .range([d3.rgb(matc1), d3.rgb(matc2)]),
    barCp = d3.scaleLinear().interpolate(d3.interpolateHcl)
    .range([d3.rgb(patc1), d3.rgb(patc2)]);

  // set defaults
  var order = "matLeave",
    classification = "developed";
	
  $("#barOrderSelectMat").addClass("active")
  $("#barOrderSelectPat").removeClass("active")

  // create tooltip and call using d3tip.js
  var barTT = d3.tip().attr('class', 'd3-tip').direction("s").offset([10, 0]).html(function(d) {
    var ml = d.matLeave + " weeks</strong> maternal leave ",
      pl = "<br> <strong>" + d.patLeave + " weeks</strong> paternal leave ",
      parl = "<br> <strong>" + d.parentalLeave + " weeks</strong> parental leave ";
    if (d.matLeave < 2 && d.matLeave > 0) ml = d.matLeave + " week </strong>maternal leave ";
    if (d.patLeave < 2 && d.patLeave > 0) pl = "<br> <strong>" + d.patLeave + " week </strong> paternal leave ";
    if (d.parentalLeave < 2 && d.parentalLeave > 0) parl = "<br> <strong>" + d.parentalLeave + " week </strong>parental leave ";
    if (d.note.length > 1) var note = "<br><br><span style='color: #b5b5b5'; font-size: 9px><em>" + d.note + "</em></span>"
    return "<div class='tooltip'><h1>" + d.country + "</h1><p>Federal policy includes <p><strong>" + ml + d.matLeavePayText + pl + d.patLeavePayText + parl + d.parentalLeavePayText + note + "</div>"
  });

  barSVG.call(barTT)

    drawBars(data, order, classification, true)
    drawAnnotations(order)

    $(".barOrderSelect").on("click", function() {

      order = $(this).val();

      if (order === "matLeave") {
        $("#barOrderSelectMat").addClass("active")
        $("#barOrderSelectPat").removeClass("active")
      }
      if (order === "patLeave") {
        $("#barOrderSelectMat").removeClass("active")
        $("#barOrderSelectPat").addClass("active")
      }

      drawAnnotations(order)
      drawBars(data, order, classification, false)
    });

    $(".barClassificationSelect").select2({
      // placeholder: "Filter by Industry",
      allowClear: true,
      width: "150px"
    });
    $('.barClassificationSelect').on("select2:select", classificationSelect);

    function classificationSelect() {
      classification = $(this).val()
      drawBars(data, order, classification, false)
    }

    // bar hop!
    function drawBars(data, order, classification, firstTime) {

      // filter according to selection
      data = data.filter(function(d) {
        return d.classification === classification;
      })

      // sort according to selection
      data.sort(function(x, y) {
        return d3.ascending(parseInt(x[order]), parseInt(y[order]));
      })

      // set min and max
      var minmaxM = d3.extent(data, function(d) {
          return parseInt(d.matLeave);
        }),
        minmaxP = d3.extent(data, function(d) {
          return parseInt(d.patLeave);
        })
      barCm.domain([minmaxM[0], minmaxM[1]]);
      barCp.domain([minmaxP[0], 18]);
      barY.domain(data.map(function(d) {
        return d.country;
      }));
      barX.domain([-minmaxP[1], minmaxM[1]])

      // call X axis if this is the first time
      if (firstTime) {
        barG.append("g")
          .attr("class", "barXaxis")
          .attr("transform", "translate(0," + barH + ")")
          .call(barXaxis);
		  
		var arrowOffset;
		if (small_screen) {
		  arrowOffset = 115;
		} else if (medium_screen) {
		  arrowOffset = 135;
		} else {
		  arrowOffset = 155;
		}

        // draw axis labels
        barG.append("text").attr("x", barX(0) + 5).attr("y", 0).attr("class", "bar-axis-label").text("Length of Maternal Leave").attr("dy", 3)
        barG.append("text").attr("x", barX(0) - 5).attr("y", 0).attr("class", "bar-axis-label").text("Length of Paternal Leave").style("text-anchor", "end").attr("dy", 3)
        barG.append("line").attr("x1", barX(0) + arrowOffset).attr("y1", 0).attr("x2", barX(0) + arrowOffset + 25).attr("y2", 0).style("fill", "none").style("stroke", "#666666").style("stroke-width", "2px").attr("marker-end", "url(#triangle)");
        barG.append("line").attr("x1", barX(0) - arrowOffset).attr("y1", 0).attr("x2", barX(0) - arrowOffset - 25).attr("y2", 0).style("fill", "none").style("stroke", "#666666").style("stroke-width", "2px").attr("marker-end", "url(#triangle)");
      }

      // new bars
      var barM = barG.selectAll(".barM")
        .data(data, function(d) {
          return d.country;
        });
      barM.enter().append("rect")
        .attr("class", function(d) {
          return "bar barM barM-" + camelize(d.country)
        })
        .attr("x", barX(0))
        .attr("y", function(d) {
          return barY(d.country);
        })
        .attr("width", 0)
        .attr("height", barY.bandwidth())
        .style("fill", "#ffffff")
        .transition().delay(500).ease(d3.easeExp, 3).duration(750)
        .attr("x", function(d) {
          return barX(0) + 5
        })
        .attr("y", function(d) {
          return barY(d.country)
        })
        .attr("width", function(d) {
          return barX(d.matLeave) - barX(0)
        })
        .style("fill", function(d) {
          return barCm(d.matLeave);
        })

      var barP = barG.selectAll(".barP")
        .data(data, function(d) {
          return d.country;
        });
      barP.enter().append("rect")
        .attr("class", function(d) {
          return "bar barP barP-" + camelize(d.country)
        })
        .attr("x", barX(0))
        .attr("y", function(d) {
          return barY(d.country);
        })
        .attr("width", 0)
        .attr("height", barY.bandwidth())
        .style("fill", "#ffffff")
        .transition().delay(500).ease(d3.easeExp, 3).duration(750)
        .attr("x", function(d) {
          return barX(-d.patLeave)
        })
        .attr("y", function(d) {
          return barY(d.country)
        })
        .attr("width", function(d) {
          if (d.patLeave > 0) return barX(d.patLeave) - barX(0) - 5
          return barX(d.patLeave) - barX(0)
        })
        .style("fill", function(d) {
          return barCp(d.patLeave);
        })

      var barLabels = barG.selectAll(".barLabels")
        .data(data, function(d) {
          return d.country;
        })
      barLabels.enter().append("text")
        .attr("class", "barLabels")
        .attr("x", barX(0) + 10)
        .attr("y", function(d) {
          return barY(d.country);
        })
        .attr("dy", barY.bandwidth() * .75)
        .style("text-anchor", "start")
        .text(function(d) {
          return d.country;
        })
        .style("fill", function(d) {
          if (d.country === "United States") return "#666666"
          return "#ffffff"
        })
        .transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", barX(0) + 10)
        .attr("y", function(d) {
          return barY(d.country);
        });

      // remove bars
      barM.exit().transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", barX(0))
        .attr("width", 0)
        .attr("height", barY.bandwidth())
        .remove();

      barP.exit().transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", barX(0))
        .attr("width", 0)
        .attr("height", barY.bandwidth())
        .remove();

      barLabels.exit().transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", barX(0))
        .remove();


      // update bar
      barM.transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", function(d) {
          return barX(0) + 5
        })
        .attr("y", function(d) {
          return barY(d.country)
        })
        .attr("width", function(d) {
          return barX(d.matLeave) - barX(0)
        })
        .style("fill", function(d) {
          return barCm(d.matLeave);
        });

      barP.transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", function(d) {
          return barX(-d.patLeave)
        })
        .attr("y", function(d) {
          return barY(d.country)
        })
        .attr("width", function(d) {
          if (d.patLeave > 0) return barX(d.patLeave) - barX(0) - 5
          return barX(d.patLeave) - barX(0)
        })
        .style("fill", function(d) {
          return barCp(d.patLeave);
        });

      barLabels.transition().ease(d3.easeExp, 3).duration(750)
        .attr("x", barX(0) + 10)
        .attr("y", function(d) {
          return barY(d.country);
        })

      d3.selectAll(".bar").on("mouseover", barTT.show).on("mouseout", barTT.hide);



    } // end bar hop
  // annotations
  function drawAnnotations(status) {
    d3.selectAll(".barAnnotation-group").remove();

    var wrap;
	if (small_screen) {
	  wrap = 120;
    } else if (medium_screen) {
	  wrap = 160;
    } else {
	  wrap = 200;
    }

    // annotations, thank you Susie Lu
    const type = d3.annotationLabel
    if (status === "matLeave") {
      const barAnnotations = [{
        note: {
          label: "The United States is the only developed country with no federal paid parental leave policy, but mandates 12 weeks unpaid leave for each parent.",
          orientation: "leftRight",
          "align": "middle",
          wrap: wrap
        },
        className: "adAnnotation bsAnnotation1 bsAnnotation-start",
        connector: {
          type: "curve",
          points: [
            [78, -6],
            [108, -14]
          ]
        },
        x: barX(0) + 100,
        y: barY("United States") + barY.bandwidth() / 2,
        dy: -60,
        dx: 150
      }, {
        note: {
          label: "Sweden tops the list on both sides, mandating up to 68 weeks paid maternal leave and 18 weeks paid paternal leave, funded by social security.",
          orientation: "leftRight",
          "align": "middle",
          wrap: wrap
        },
        className: "adAnnotation bsAnnotation1 bsAnnotation-end",
        connector: {
          type: "curve",
          points: [
            [-5, 40],
            [-10, 50]
          ]
        },
        x: barX(-5),
        y: barY("Sweden") + barY.bandwidth() + 5,
        dy: 70,
        dx: -40
      }]

      const barMakeAnnotations = d3.annotation()
        .type(type)
        .annotations(barAnnotations);

      barG.append("g")
        .attr("class", "barAnnotation-group")
        .call(barMakeAnnotations);

    } else {
      const barAnnotations = [{
        note: {
          label: "Many developed countries offer no paid paternal leave, leaving it up to private companies to create their own policies.",
          orientation: "leftRight",
          "align": "middle",
          wrap: wrap
        },
        className: "adAnnotation bsAnnotation1 bsAnnotation-end",
        connector: {
          type: "curve",
          points: [
            [-30, -6],
            [-50, -14]
          ]
        },
        x: barX(-1) - 4,
        y: barY("Iceland") + barY.bandwidth(),
        dy: -34,
        dx: -80
      }, {
        note: {
          label: "Some countries, like the United Kingdom, offer split parental leave. The UK requires 2 weeks maternal leave, while the remaining 50 weeks can be split between either parent.",
          orientation: "leftRight",
          "align": "middle",
          wrap: wrap
        },
        className: "adAnnotation bsAnnotation1 bsAnnotation-end",
        connector: {
          type: "curve",
          points: [
            [-15, 10],
            [-15, 10]
          ]
        },
        x: barX(-2) - 4,
        y: barY("Cyprus") + barY.bandwidth() / 2,
        dy: 34,
        dx: -40
      }]

      const barMakeAnnotations = d3.annotation()
        .type(type)
        .annotations(barAnnotations);

      barG.append("g")
        .attr("class", "barAnnotation-group")
        .call(barMakeAnnotations);
    }
    d3.selectAll(".barAnnotation-group").selectAll(".annotation-note-label").attr("y", 10)
  } // end annotations

}
// draw everything
barChart()

// on resize
window.addEventListener('resize', resize)

function resize() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  if (windowW > 1000) {
    large_screen = true;
  } else if (windowW > 763) {
    medium_screen = true;
  } else {
    small_screen = true;
    barMargin.left = 10;
    barMargin.right = 10;
  }
	
  barChart()
}
}) // end load data
	
// to clean up company names for id tags
function camelize(str) {
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '').replace("&", "and").replace(/,/g, "").replace(/'/g, "").replace("1800GOTJUNK?", "one800GotJunk").replace("15Five", "fifteenFive").replace("22squared", "twentytwoSquared").replace("270Strategies", "two70strategies").replace("2U", "twoU").replace("2k", "twoK").replace("3M", "threeM").replace("500friends", "fiveHundredFriends").replace("7Eleven", "sevenEleven").replace("72andsunny", "seventyTwoandSunny").replace("8451°", "eighty451degrees");
}