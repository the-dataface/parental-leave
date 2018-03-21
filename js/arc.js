// -- SETUP --

// window width and height (from previous DataFace projects)
var windowW = window.innerWidth;
var arcWindowW = window.innerWidth;
var windowH = window.innerHeight;

// margin setup
var arcMargin = {
  top: 100,
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
  arcMargin.left = 10;
  arcMargin.right = 10;
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
d3.csv("http://the-dataface.github.io/parental-leave/data/companies-top.csv", function(error, data) {
	if (error) throw error;
	
function arcDiagram() {
  // remove
  d3.selectAll(".arcdiagram > *").remove();

  // setup
  var adW = windowW, 
	  cH;
  if (small_screen) {
	  cH = 150;
  } else if (medium_screen) {
	  cH = 175;
  } else if (large_screen) {
	  cH = 200;
  }
  
  var adH = (10 * cH);

  var rightmargin = 50;
	
  var leftmargin = 250;
  if (small_screen) leftmargin = 50;

  adMargin = {
    top: 0,
    right: rightmargin,
    bottom: 0,
    left: leftmargin
  }

  if (large_screen) adW = 980;

  adW = adW - arcMargin.left - arcMargin.right - adMargin.left - adMargin.right;
  adH = adH - arcMargin.top - arcMargin.bottom;
  var Gtrans = adMargin.left + arcMargin.left

  var adSVG = d3.select(".arcdiagram")
    .attr("width", adW + arcMargin.left + arcMargin.right + adMargin.left + adMargin.right)
    .attr("height", adH + arcMargin.top + arcMargin.bottom),
    adG = adSVG.append("g")
    .attr("transform", "translate(" + Gtrans + "," + (-20) + ")")
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

  if (medium_screen || large_screen) {
	  adSVG.attr("transform", "translate(" + (windowW - adSVG.attr('width')) / 2 + ")");
  } else {
	  adSVG.attr("transform", "translate(0)");
  }

    // set up some basics
    var adr = 3;

    // draw the stuff!
    for (i = 0; i < data.length; i++) {
      var p = cH * (i + 1);

      // draw arcs
      var arcGen = d3.arc();
      drawMarc(data[i].mat_paid, 0, p, "mat", "p")
      drawMarc(data[i].mat_unpaid, data[i].mat_paid, p, "mat", "up")
      drawParc(data[i].pat_paid, 0, p, "pat", "p", data[i].company)
      drawParc(data[i].pat_unpaid, data[i].pat_paid, p, "pat", "up", data[i].company)

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
            if (adX(x2) < 50) return "#666666"
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

      function drawParc(x2, add, y2, gen, kind, comp) {
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
            if (adX(x2) < 50) return "#666666"
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
          .style("fill", function(d) {
			if (comp == 'Kroger' || comp == "McDonald's") {
				return '#666666';
			} else {
				return 'white';
			}
		  })
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
	  
	  /*
	  var overlapCompanies = ['IBM', 'Yum! Brands', 'Amazon'], 
		  overlapComDy,
	  	  overlapLocDy,
		  overlapEmpDy;
		
	  if (overlapCompanies.indexOf(data[i].company) > -1 ) {
		  console.log('hi');
		  overlapComDy = -20;
	  	  overlapLocDy = 0;
		  overlapEmpDy = 10;
	  } else {
		  overlapComDy = -32;
	  	  overlapLocDy = -20;
		  overlapEmpDy = -10;
	  }
	  */
		
	  var allX,
	  	  comDy,
	      locDy,
          empDy;
		
		/*  
	  if (small_screen) {
		  allX = -50,
		  comDy = -30, 
		  locDy = -12,
		  empDy = 0;
	  } else {
		  allX = -80,
		  comDy = -40, 
		  locDy = -18,
		  empDy = 0;
	  }
	  */
	  
	  if (small_screen) {
		  allX = adX(50),
		  comDy = -60, 
		  locDy = -42,
		  empDy = -30;
	  } else {
		  allX = -80,
		  comDy = -40, 
		  locDy = -18,
		  empDy = 0;
	  }

      // draw labels
      adG.append("text").attr("class", "axislabel").attr("x", adX(0)).attr("y", p).attr("dx", -7.5).attr("dy", 3).style("text-anchor", "end").text("BIRTH")
      adG.append("text").attr("class", "axislabel").attr("x", adX(52)).attr("y", p).attr("dx", 7.5).attr("dy", 3).style("text-anchor", "start").text("52 WKS")
	  /*
      adG.append("text").attr("class", "chartTitle").attr("x", 0).attr("dy", overlapComDy).attr("y", p - (adX(data[i].mat_paid) / 2)).style("text-anchor", "start").text(data[i].company)
	  */
      adG.append("text").attr("class", "chartTitle").attr("x", allX).attr("dy", comDy).attr("y", p).style("text-anchor", "end").text(data[i].company)
      adG.append("text").attr("class", "chartTitleh2").attr("x", allX).attr("dy", locDy).attr("y", p).style("text-anchor","end").text(data[i].location)
      adG.append("text").attr("class", "chartTitleh2").attr("x", allX).attr("dy", empDy).attr("y", p).style("text-anchor", "end").text(data[i].employees + " employees")

    } //end drawing stuff

    // annotations, thank you Susie Lu
	// variables for annotation location so can fit on mobile
	
	var multiplier = 1,
		yMatLocation = cH - adX(4.5);
	
	if (small_screen) {
		multiplier = -1,
		yMatLocation = cH
	}
	
    const type = d3.annotationLabel;
	
	const adAnnotations = [{
		note: {
		  label: "Paid Maternal Leave",
		  lineType: "none",
		  "align": "middle",
		  wrap: 200
		},
		className: "adAnnotation",
		x: adX(8),
		y: cH - adX(8),
		dy: -10,
		dx: 0
	  },
	  {
		note: {
		  label: "Unpaid Maternal Leave",
		  lineType: "none",
		  "align": "middle",
		  wrap: 200
		},
		className: "adAnnotation",
		x: adX(20.5),
		y: yMatLocation,
		dy: (-10) * multiplier,
		dx: 0
	  },
	  {
		note: {
		  label: "Paid Paternal Leave",
		  lineType: "none",
		  "align": "middle",
		  wrap: 200
		},
		className: "adAnnotation",
		connector: {
		  type: d3.annotationCalloutElbow
		},
		x: adX(3),
		y: cH + adX(3),
		dy: 10,
		dx: 0
	  }
	];
	
	

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
  if (arcWindowW != window.innerWidth) {
	  windowW = window.innerWidth;
	  arcWindowW = window.innerWidth;
	  windowH = window.innerHeight;

	  large_screen = false;
	  medium_screen = false;
	  small_screen = false;

	  if (windowW > 1000) {
		large_screen = true;
	  } else if (windowW > 763) {
		medium_screen = true;
	  } else {
		small_screen = true;
		arcMargin.left = 10;
		arcMargin.right = 10;
	  }

	  arcDiagram()
  }
}
}) // end load data


