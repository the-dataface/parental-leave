// -- SETUP --
$(document).ready(function() {
	// window width and height (from previous DataFace projects)
    var windowW = window.innerWidth;
    var barWindowW = window.innerWidth;
    var windowH = window.innerHeight;

    // barMargin setup
    var barMargin = {
        top: 30,
        right: 30,
        bottom: 40,
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
    d3.csv("https://the-dataface.github.io/parental-leave/data/countries-updated.csv", function(error, data) {
        if (error) throw error;
		
		var arrowOffset,
			arrowSize;

        function barChart() {
            // remove
            d3.selectAll(".barchart > *").remove();

            var barW,
                barH = 1000;
            // setup
            if (windowW > 1500) {
                barW = 1450;
                barMargin.left = (windowW - 1450) / 2;
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
                .range([70, barW]),
                barY = d3.scaleBand()
                .rangeRound([barH, 0])
                .padding(0.2)

            formatPercent = d3.format("%");

            // set up axes
            var tickNumber;
            if (small_screen) {
                tickNumber = 6;
            } else {
                tickNumber = 10;
            }
            var barXaxis = d3.axisBottom(barX)
                .ticks(tickNumber, ".0s")
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
            var barTT = d3.tip().attr('class', 'd3-tip').direction("s").offset(function() {
				return [0, -this.getBBox().width / 2]
			}).html(function(d) {
                var matPayAst = "",
                    matLeaveAst = "",
                    patPayAst = "",
                    patLeaveAst = "",
                    parPayAst = "",
                    parLeaveAst = "";
                if (d.country == 'Croatia' || d.country == 'Australia' || d.country == 'Ireland' || d.country == 'Malta' || d.country == 'Belgium') {
                    matPayAst = "*";
                }
                if (d.country == 'United Kingdom' || d.country == 'Norway' || d.country == 'Spain' || d.country == 'Spain' || d.country == 'Romania' || d.country == 'Portugal') {
                    matLeaveAst = "*";
                }
                if (d.country == 'Australia') {
                    patPayAst = "*";
                }
                if (d.country == 'Norway' || d.country == 'Romania' || d.country == 'New Zealand') {
                    patLeaveAst = "*";
                }
                if (d.country == 'Austria') {
                    parPayAst = "*";
                }
                if (d.country == 'Portugal' || d.country == 'Romania' || d.country == 'Japan' || d.country == 'Australia' || d.country == 'New Zealand') {
                    parLeaveAst = "*";
                }
                var patLeaveMetric = "weeks";
                if (d.country == 'Romania') {
                    patLeaveMetric = "days";
                }
                var pLsub;
                if (d.parentalLeavePay == 'a flat rate') {
                    pLsub = "<span class='weekAmountSubText tooltipWeeks parText'></span>";
                } else {
                    pLsub = "<span class='weekAmountSubText tooltipWeeks parText'>of salary</span>";
                };

                var prenote = "<br><span class='matText'>" + matPayAst + matLeaveAst + "</span><span class='patText'>" + patPayAst + patLeaveAst + "</span><span class='parText'>" + parPayAst + parLeaveAst + "</span>";

                var
                    matNote = "",
                    patNote = "",
                    parNote = "";
                if (d.matNote.length > 1) matNote = "<p style='color: #b5b5b5;font-size:13px;margin:0;margin-top:12px'><span class='matText'>*</span><em>" + d.matNote + "</em></p>"
                if (d.patNote.length > 1) patNote = "<p style='color: #b5b5b5;font-size:13px;margin:0;margin-top:12px'><span class='patText'>*</span><em>" + d.patNote + "</em></p>"
                if (d.parNote.length > 1) parNote = "<p style='color: #b5b5b5;font-size:13px;margin:0;margin-top:12px'><span class='parText'>*</span><em>" + d.parNote + "</em></p>"

                return "<div class='tooltip bar-tooltip'><p class='tooltip-header'>" + d.country + "</p><p class='tooltip-sub-header'>Funded by " + d.source + "</p><div class='table-row table-header'><p class='first-cell flex-cell'></p><p class='second-cell flex-cell'>Leave</p><p class='third-cell flex-cell'>Amount</p></div><div class='table-row'><p class='first-cell flex-cell'>Maternal Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks matText'>" + d.matLeave + matLeaveAst + "</span><span class='weekAmountSubText tooltipWeeks matText'>weeks</span></div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks matText'>" + d.matLeavePay + matPayAst + "</span><span class='weekAmountSubText tooltipWeeks matText'>of salary</span></div></div><div class='table-row'><p class='first-cell flex-cell'>Paternal Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks patText'>" + d.patLeave + patLeaveAst + "</span><span class='weekAmountSubText tooltipWeeks patText'>" + patLeaveMetric + "</span></div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks patText'>" + d.patLeavePay + patPayAst + "</span><span class='weekAmountSubText tooltipWeeks patText'>of salary</span></div></div><div class='table-row'><p class='first-cell flex-cell'>Parental Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks parText'>" + d.parentalLeave + parLeaveAst + "</span><span class='weekAmountSubText tooltipWeeks parText'>weeks</span></div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks parText'>" + d.parentalLeavePay + parPayAst + "</span>" + pLsub + "</div></div>" + matNote + patNote + parNote + "</div>"

            });

            barSVG.call(barTT)
            barSVG.on('click', function() {
                barTT.hide;
            })

            /*
  d3.select('.d3-tip').on("click", function() {
		barTT.hide
	});
	*/

            drawBars(data, order, classification, true)
            if (!small_screen) {
                drawAnnotations(order)
            }
            //d3.select('.d3-tip').style('display', 'none');

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

                if (!small_screen) {
                    drawAnnotations(order)
                }
                drawBars(data, order, classification, false)
            });
			
			/*
			
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
			*/

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
                barX.domain([-20, minmaxM[1]])

				d3.select(".barXaxis").remove();
				
				barG.append("g")
					.attr("class", "barXaxis")
					.attr("transform", "translate(0," + barH + ")")
					.call(barXaxis);
				
				if (small_screen) {
					arrowOffset = 115;
					arrowSize = 10;
				} else if (medium_screen) {
					arrowOffset = 135;
					arrowSize = 25;
				} else {
					arrowOffset = 155;
					arrowSize = 25;
				}

				// draw axis labels
				barG.append("text").attr("x", barX(0) + 5).attr("y", 0).attr("class", "bar-axis-label").text("Length of Maternal Leave").attr("dy", 3)
				barG.append("text").attr("x", barX(0) - 5).attr("y", 0).attr("class", "bar-axis-label").text("Length of Paternal Leave").style("text-anchor", "end").attr("dy", 3)
				barG.append("line").attr("x1", barX(0) + arrowOffset).attr("y1", 0).attr("x2", barX(0) + arrowOffset + arrowSize).attr("y2", 0).style("fill", "none").style("stroke", "#666666").style("stroke-width", "2px").attr("marker-end", "url(#triangle)");
				barG.append("line").attr("x1", barX(0) - arrowOffset + 2).attr("y1", 0).attr("x2", barX(0) - arrowOffset - arrowSize).attr("y2", 0).style("fill", "none").style("stroke", "#666666").style("stroke-width", "2px").attr("marker-end", "url(#triangle)");

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
                    .attr("x", function(d) {
                        if ((barX(d['matLeave']) - barX(0)) < 80 && small_screen) {
                            return barX(d['matLeave']) + 10;
                        } else {
                            return barX(0) + 10;
                        }
                        //return barX(0) + 10;
                    })
                    .attr("y", function(d) {
                        return barY(d.country);
                    })
                    .attr("dy", barY.bandwidth() * .75)
                    .style("text-anchor", "start")
                    .text(function(d) {
                        return d.country;
                    })
                    .style("fill", function(d) {
                        if (d.country === "United States") {
                            return "black";
                        } else {
                            if ((barX(d['matLeave']) - barX(0)) < 80 && small_screen) {
                                return "#666666";
                            } else {
                                return "#ffffff";
                            }
                        }

                    })
                    .transition().ease(d3.easeExp, 3).duration(750)
                    .attr("x", function(d) {
                        if ((barX(d['matLeave']) - barX(0)) < 80 && small_screen) {
                            return barX(d['matLeave']) + 10;
                        } else {
                            return barX(0) + 10;
                        }
                        //return barX(0) + 10;
                    })
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
                    .attr("x", function(d) {
                        if ((barX(d['matLeave']) - barX(0)) < 80 && small_screen) {
                            return barX(d['matLeave']) + 10;
                        } else {
                            return barX(0) + 10;
                        }
                    })
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
                    wrap = 100;
                } else if (medium_screen) {
                    wrap = 140;
                } else {
                    wrap = 200;
                }

                // annotations, thank you Susie Lu
                var xMatLocation = barX(0) + 100,
                    dyMatLocation = -(barY.bandwidth() * 2),
                    dxMatLocation = barX(15) - barX(0);

                if (small_screen) {
                    xMatLocation = barX(0),
                        dyMatLocation = 0,
                        dxMatLocation = barX(0) - barX(13)
                }

                const type = d3.annotationLabel
                if (status === "matLeave") {
                    const barAnnotations = [{
                        note: {
                            label: "The United States is the only developed country with no federal paid parental leave policy, but mandates 12 weeks unpaid leave for each parent.",
                            "align": "middle",
                            orientation: "leftRight",
                            wrap: wrap
                        },
                        className: "adAnnotation bsAnnotation1 bsAnnotation-start",
                        connector: {
                            type: "curve",
                            points: [
                                [barX(15) - barX(0) - 100, -(barY.bandwidth() * .5)],
                                [barX(20) - barX(0) - 100, -(barY.bandwidth() * 2)]
                            ]
                        },
                        x: barX(0) + 100,
                        y: barY("United States") + barY.bandwidth() / 2,
                        dy: -(barY.bandwidth() * 4),
                        dx: barX(15) - barX(0)
                    }, {
                        note: {
                            label: "Sweden tops the list on both sides, mandating up to 68 weeks paid maternal leave and 18 weeks paid paternal leave, funded by social security.",
                            "align": "middle",
                            wrap: wrap
                        },
                        className: "adAnnotation bsAnnotation1 bsAnnotation-end",
                        x: barX(-16),
                        y: barY("Sweden") + barY.bandwidth() + 5,
                        dy: 20,
                        dx: 0
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
                        x: barX(-1) - 4,
                        y: barY.bandwidth() * 43 + barMargin.top,
                        dy: -20,
                        dx: -(barX(8) - barX(0))
                    }, {
                        note: {
                            label: "Some countries, like the United Kingdom, offer split parental leave. The UK requires 2 weeks maternal leave, while the remaining 50 weeks can be split between either parent.",
                            orientation: "leftRight",
                            "align": "middle",
                            wrap: wrap
                        },
                        className: "adAnnotation bsAnnotation1 bsAnnotation-end",
                        x: barX(-2) - 4,
                        y: barY.bandwidth() * 19.5 + barMargin.top,
                        dy: 34,
                        dx: -(barX(8) - barX(0))
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
            if (barWindowW != window.innerWidth) {
                windowW = window.innerWidth;
                barWindowW = window.innerWidth;
                windowH = window.innerHeight;
				
				// what size screen?
				large_screen = false;
				medium_screen = false;
				small_screen = false;

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
        }
    }) // end load data

    // to clean up company names for id tags
    function camelize(str) {
        return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '').replace("&", "and").replace(/,/g, "").replace(/'/g, "").replace("1800GOTJUNK?", "one800GotJunk").replace("15Five", "fifteenFive").replace("22squared", "twentytwoSquared").replace("270Strategies", "two70strategies").replace("2U", "twoU").replace("2k", "twoK").replace("3M", "threeM").replace("500friends", "fiveHundredFriends").replace("7Eleven", "sevenEleven").replace("72andsunny", "seventyTwoandSunny").replace("8451°", "eighty451degrees");
    }
})