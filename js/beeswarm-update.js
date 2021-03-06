// -- SETUP --
$(document).ready(function() {
    // window width and height (from previous DataFace projects)
    var windowW = window.innerWidth;
    var bsWindowW = window.innerWidth;
    var windowH = window.innerHeight;
    var barControlHeight = $('.bsControl').height();

    // margin setup
    var swarmMargin = {
        top: 30,
        right: 30,
        bottom: 60,
        left: 30
    };

    var swarmMarginMobile = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    };

    // what size screen?
    var large_screen = false;
    var medium_screen = false;
    var small_screen = false;

    var prev_mobile = false;

    if (windowW > 1000) {
        large_screen = true;
    } else if (windowW > 763) {
        medium_screen = true;
    } else {
        small_screen = true;
        prev_mobile = true;
    }

    // colours
    var matc1 = "#fdae95",
        matc2 = "#fa4d16",
        patc1 = "#88cae3",
        patc2 = "#027296",
        matc1rgb = "253, 174, 149",
        patc1rgb = "136, 202, 227";

    // -- CHART 2: BEESWARM --
    // showing every company's parental leave policies from 0 to 52 weeks, with options for paid vs unpaid, search, and industry filter

    // bring in the data
    d3.csv(asset_path + "companies.csv", function(error, data) {
        if (error) throw error;

        data = data.filter(function(d) {
            return d['country'] == 'USA';
        })

        // filter data depending on what we're looking at
        var data_mat_paid = data.filter(function(d) {
            return d["mat_paid"] >= 1
        })
        var data_mat_unpaid = data.filter(
            function(d) {
                return d["mat_unpaid"] >= 1
            })
        var data_pat_paid = data.filter(
            function(d) {
                return d["pat_paid"] >= 1
            })
        var data_pat_unpaid = data.filter(
            function(d) {
                return d["pat_unpaid"] >= 1
            })

        // draw the first two swarms: maternal on top, paternal on bottom
        var m = {
                gender: "mat",
                variable: "paid",
                placement: .25,
                data: data_mat_paid,
                c1: matc1,
                c2: matc2
            },
            p = {
                gender: "pat",
                variable: "paid",
                placement: .75,
                data: data_pat_paid,
                c1: patc1,
                c2: patc2
            };

        var status = 'paid',
            gender = 'maternity';

        var bsSVG,
            bsG,
            aLine,
            mAline,
            mAtext,
            pAline,
            pAtext,
            mMline,
            mMtext,
            pMline,
            pMtext

        // desktop setup
        var bsW = windowW, // beeswarm width = full width
            bsH = 800,
            r = 3,
            linemargin = 15,
            linemarginMobile = 0;

        bsW = bsW - swarmMargin.left - swarmMargin.right;
        bsH = bsH - swarmMargin.top - swarmMargin.bottom;

        var x = d3.scaleLinear()
            .rangeRound([0, bsW * .25, bsW * .5, bsW * .75, bsW])
            .domain([0, 6.5, 13, 26, 52]),
            xAxis = d3.axisBottom(x)
            .ticks(20, ".0s")
            .tickSizeOuter(0);

        // mobile setup
        var bsWMobile = windowW, // beeswarm width = full width
            bsHMobile = (windowH * 1.6) - barControlHeight, // beeswarm height = full height
            r = 3,
            linemargin = 15;

        bsWMobile = bsWMobile - swarmMarginMobile.left - swarmMarginMobile.right;
        bsHMobile = bsHMobile - swarmMarginMobile.top - swarmMarginMobile.bottom;

        var y = d3.scaleLinear()
            .rangeRound([0, bsHMobile * .25, bsHMobile * .5, bsHMobile * .75, bsHMobile])
            .domain([0, 6.5, 13, 26, 52]),
            yAxis = d3.axisLeft(bsHMobile)
            .tickSizeOuter(0);

        var suppData = {
            pat_paidavg: 4.51,
            pat_unpaidavg: 7.95,
            mat_paidavg: 8.01,
            mat_unpaidavg: 8.79,
            pat_paidmed: 2,
            pat_unpaidmed: 6,
            mat_paidmed: 6,
            mat_unpaidmed: 8
        }

        function beeSwarm() {
            // remove all
            d3.selectAll(".beeswarm").remove();

            d3.select('#bsMetricSelectPaid').style('display', 'inline-block');
            d3.select('#bsMetricSelectUnpaid').style('display', 'inline-block');
            d3.select('#bsPayGenderSelectContainer').style('display', 'none');

            bsSVG = d3.select("#beeswarm-container").append('svg')
                .classed('beeswarm', true)
                .attr("width", bsW + swarmMargin.left + swarmMargin.right - 15)
                .attr("height", bsH + swarmMargin.top + swarmMargin.bottom);

            bsG = bsSVG.append("g")
                .attr("transform", "translate(" + swarmMargin.left + "," + swarmMargin.top + ")"),
                formatNumber = d3.format(",");

            // draw average lines
            mAline = bsG.append("line").attr("class", "aLine").attr("x1", x(suppData["mat_paidavg"])).attr("x2", x(suppData["mat_paidavg"])).attr("y1", (0) + linemargin).attr("y2", (bsH * .5) - linemargin).style("stroke", matc1);

            mAtext = bsG.append("text").attr("class", "aText").attr("x", x(suppData["mat_paidavg"])).attr("y", linemargin).text("AVG " + suppData["mat_paidavg"].toFixed(1)).style("fill", matc1).style("text-anchor", "start").attr("dy", -4).attr("dx", -6)

            pAline = bsG.append("line").attr("class", "aLine").attr("x1", x(suppData["pat_paidavg"])).attr("x2", x(suppData["pat_paidavg"])).attr("y1", (bsH * .5) + linemargin).attr("y2", bsH - linemargin).style("stroke", patc1);

            pAtext = bsG.append("text").attr("class", "aText").attr("x", x(suppData["pat_paidavg"])).attr("y", (bsH - linemargin) + linemargin).text("AVG " + suppData["pat_paidavg"].toFixed(1)).style("fill", patc1).style("text-anchor", "start").attr("dy", 4).attr("dx", -6)

            mMline = bsG.append("line").attr("class", "aLine").attr("x1", x(suppData["mat_paidmed"])).attr("x2", x(suppData["mat_paidmed"])).attr("y1", (0) + linemargin).attr("y2", (bsH * .5) - linemargin).style("stroke", matc1);

            mMtext = bsG.append("text").attr("class", "aText").attr("x", x(suppData["mat_paidmed"])).attr("y", linemargin).text("MEDIAN " + suppData["mat_paidmed"].toFixed(1)).style("fill", matc1).style("text-anchor", "end").attr("dy", -4).attr("dx", 6)

            pMline = bsG.append("line").attr("class", "aLine").attr("x1", x(suppData["pat_paidmed"])).attr("x2", x(suppData["pat_paidmed"])).attr("y1", (bsH * .5) + linemargin).attr("y2", bsH - linemargin).style("stroke", patc1);

            pMtext = bsG.append("text").attr("class", "aText").attr("x", x(suppData["pat_paidmed"])).attr("y", (bsH - linemargin) + linemargin).text("MEDIAN " + suppData["pat_paidmed"].toFixed(1)).style("fill", patc1).style("text-anchor", "end").attr("dy", 4).attr("dx", 6)

            // draw labels/ticks
            bsG.append("text").attr("class", "axislabel").attr("id", "axisLabelStart").attr("x", x(0)).attr("y", bsH / 2).text("0 weeks").attr("dy", 3);
            bsG.append("text").attr("class", "axislabel").attr("id", "axisLabelEnd").attr("x", x(52)).attr("y", bsH / 2).text("52 weeks").style("text-anchor", "end").attr("dy", 3);
            var bsTicks = [4, 8, 16, 32]
            for (var i = 0; i < bsTicks.length; i++) {
                bsG.append("text").attr("class", "axislabel").attr("id", "axisLabel" + i).attr("x", x(bsTicks[i])).attr("y", (bsH / 2)).text(bsTicks[i] + " weeks").style("text-anchor", "middle").attr("dy", 3);
                bsG.append("line").attr("class", "axisTick").attr("id", "axisTickM" + i).attr("x1", x(bsTicks[i])).attr("x2", x(bsTicks[i])).attr("y1", linemargin).attr("y2", (bsH / 2) - linemargin);
                bsG.append("line").attr("class", "axisTick").attr("id", "axisTickP" + i).attr("x1", x(bsTicks[i])).attr("x2", x(bsTicks[i])).attr("y1", (bsH / 2) + linemargin).attr("y2", bsH - linemargin);
            }


            var xCoord,
                rectWidth;
            if (small_screen) {
                rectWidth = 200;
                rectHeight = 33;
            } else if (medium_screen) {
                rectWidth = 220;
                rectHeight = 33;
            } else {
                rectWidth = 250;
                rectHeight = 37;
            }

            if (windowW > 1300) {
                xCoord = bsW / 2;
            } else {
                xCoord = (2 * bsW) / 3;
            }

            //maternity leave chart header
            bsG.append("rect").attr("class", "backgroundRect mbackgroundRect").attr("x", xCoord - (rectWidth / 2)).attr("y", 15 - (rectHeight / 2)).attr("rx", 1).attr("ry", 1).attr('width', rectWidth).attr('height', rectHeight).style('stroke', 'none').style('fill', '#fdae95');
            bsG.append("text").attr("class", "chartTitle bsChartTitle").attr("x", xCoord).attr("y", 15).style("text-anchor", "middle").text("Length of Maternity Leave")

            //paternity leave chart header
            bsG.append("rect").attr("class", "backgroundRect pbackgroundRect").attr("x", xCoord - (rectWidth / 2)).attr("y", bsH - 15 - (rectHeight / 2)).attr("rx", 1).attr("ry", 1).attr('width', rectWidth).attr('height', rectHeight).style('stroke', 'none').style('fill', '#88cae3');
            bsG.append("text").attr("class", "chartTitle bsChartTitle").attr("x", xCoord).attr("y", bsH - 15).style("text-anchor", "middle").text("Length of Paternity Leave")

            // create tooltip and call using d3tip.js
            var bsTT = d3.tip().attr('class', 'd3-tip').direction(function(d) {
				/*
				var top = false,
					bottom = false,
					left = false,
					right = false,
					swarmW = d3.select('.beeswarm').attr('width'),
					swarmH = d3.select('.beeswarm').attr('height')
				
				console.log(swarmW + ', ' + this.cx.baseVal.value + ', ' + swarmH + ', ' + this.cy.baseVal.value);
							
				if (this.cx.baseVal.value < (swarmW / 2)) {
					left = true;
				} else {
					right = true;
				}
				
				if (this.cy.baseVal.value < (swarmH / 2)) {
					top = true;
				} else {
					bottom = true;
				}
				
				if (top && left) {
					return 'se';
				} else if (top && right) {
					return 'sw';	   
				} else if (bottom && left) {
					return 'ne';
				} else {
					return 'nw';
				}
				*/
				return 's';
			
			}).offset(function(d) {

				var top = false,
					bottom = false,
					left = false,
					right = false,
					swarmW = d3.select('.beeswarm').attr('width'),
					swarmH = d3.select('.beeswarm').attr('height')
							
				if (this.cx.baseVal.value < (swarmW / 2)) {
					left = true;
				} else {
					right = true;
				}
				
				if (this.cy.baseVal.value < (swarmH / 2)) {
					top = true;
				} else {
					bottom = true;
				}
				
				if (top && left) {
					return [0, 0];
				} else if (top && right) {
					return [0, -200];	   
				} else if (bottom && left) {
					return [0, 0];
				} else {
					return [0, -200];
				}
			
			}).html(function(d) {
                var mpL = (d.mat_paid == -5) ? '—' : d.mat_paid,
                    muL = (d.mat_unpaid == -5) ? '—' : d.mat_unpaid,
                    ppL = (d.pat_paid == -5) ? '—' : d.pat_paid,
                    puL = (d.pat_unpaid == -5) ? '—' : d.pat_unpaid,
                    mpT = "",
                    muT = "",
                    ppT = "",
                    puT = "",
                    ind = "<strong>" + d.industry + "</strong><br>",
                    city = d.city + ", ",
                    state = d.state + ", ",
                    country = d.country;
				
                (mpL != '—') ? mpT = "<span class='weekAmountSubText tooltipWeeks matText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";
                (muL != '—') ? muT = "<span class='weekAmountSubText tooltipWeeks matText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";
                (ppL != '—') ? ppT = "<span class='weekAmountSubText tooltipWeeks patText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";
                (puL != '—') ? puT = "<span class='weekAmountSubText tooltipWeeks patText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";

                return "<div class='tooltip bs-tooltip'><p class='tooltip-header'>" + d.company + "</p><p class='tooltip-sub-header'>" + d.industry + "</p><div class='table-row table-header'><p class='first-cell flex-cell'></p><p class='second-cell flex-cell'>Paid</p><p class='third-cell flex-cell'>Unpaid</p></div><div class='table-row'><p class='first-cell flex-cell'>Maternity Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks matText'>" + mpL + "</span>" + mpT + "</div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks matText'>" + muL + "</span>" + muT + "</div></div><div class='table-row'><p class='first-cell flex-cell'>Paternity Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks patText'>" + ppL + "</span>" + ppT + "</div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks patText'>" + puL + "</span>" + puT + "</div></div></div>"
            });

            bsSVG.call(bsTT)
            bsSVG.on('click', function() {
                bsTT.hide;
            })

            var industry = 'all';

            // set up controls using select2.js
            //    industry filter
            $("#bsIndustrySelect").select2({
                placeholder: "Filter by Industry",
                allowClear: true,
                width: "150px"
            });
            $('.bsIndustrySelect').on("select2:select", industryselect);
            $('.bsIndustrySelect').on("select2:unselect", function() {
                industry = 'all';
                filterclear();
            });

            //    company search, will populate later
            $('#bsSearch').select2({ // company search
                placeholder: "Find a Company...",
                allowClear: true,
                width: "150px"
            });
            $('.bsSearch').on("select2:select", companysearch);
            $('.bsSearch').on("select2:unselect", filterclear);

            var bsSearch = d3.select(".bsSearch");
            bsSearch.append("option")
                .attr("value", "")
                .text("");

            function industryselect() {
                industry = $(this).val();
                $('.bsSearch').val(null).trigger('change');
                d3.selectAll(".companies").style("visibility", "hidden")
                d3.selectAll("." + industry).style("visibility", "visible").style("opacity", 1)

                d3.selectAll('.adAnnotation').style('visibility', 'hidden');

                if (status == 'paid') {
                    if (industry == 'other') {
                        d3.select('.bsGatesAnnotation').style('visibility', 'visible');
                    } else if (industry == 'technology') {
                        d3.select('.bsNetflixAnnotation').style('visibility', 'visible');
                    }
                }

                resetSearch(industry, status);

            }

            function companysearch() {
                var company = $(this).val();
                d3.selectAll(".companies").style("opacity", .15).style("stroke", "none").attr("r", r);
                d3.selectAll("#" + company).style("opacity", 1).style("stroke", "black").style("stroke-width", "1px").attr("r", 6);

                d3.selectAll('.adAnnotation').style('visibility', 'hidden');

                if (status == 'paid') {
                    if (company == 'billAndMelindaGatesFoundation') {
                        d3.select('.bsGatesAnnotation').style('visibility', 'visible');
                    } else if (company == 'netflix') {
                        d3.select('.bsNetflixAnnotation').style('visibility', 'visible');
                    }
                }
            }

            function filterclear() {
                d3.selectAll(".companies").style("visibility", "hidden").style("stroke", "none").attr("r", r);
                if (industry == 'all') {
                    d3.selectAll(".companies").style("visibility", "visible").style("opacity", 1);
                    d3.selectAll('.adAnnotation').style('visibility', 'visible');
                } else {
                    if (industry == 'other') {
                        d3.select('.bsGatesAnnotation').style('visibility', 'visible');
                    } else if (industry == 'technology') {
                        d3.select('.bsNetflixAnnotation').style('visibility', 'visible');
                    }
                    d3.selectAll("." + industry).style("visibility", "visible").style("opacity", 1);
                }


                resetSearch(industry, status);

            }

            drawAnnotations(status);
            drawSwarm(m);
            drawSwarm(p);

            // redraw when paid/unpaid is clicked
            $(".bsMetricSelect").on("click", function() {
                if (!small_screen) {
                    $('.bsSearch').val(null).trigger('change');
                    $('.bsIndustrySelect').val(null).trigger('change');
                    d3.selectAll(".companies").style("visibility", "visible").style("opacity", 1).style("stroke", "none").attr("r", r)

                    status = $(this).val();
                    m.variable = status;
                    p.variable = status;

                    if (status === "paid") {
                        $("#bsMetricSelectPaid").addClass("active")
                        $("#bsMetricSelectUnpaid").removeClass("active")
                        m.data = data_mat_paid;
                        p.data = data_pat_paid;
                    }
                    if (status === "unpaid") {
                        $("#bsMetricSelectPaid").removeClass("active")
                        $("#bsMetricSelectUnpaid").addClass("active")
                        m.data = data_mat_unpaid;
                        p.data = data_pat_unpaid;
                    }

                    industry = 'all';
                    resetSearch(industry, status);

                    drawAnnotations(status);
                    drawSwarm(m);
                    drawSwarm(p);
                }
            });

            // populate the search
            resetSearch(industry, status);

            function drawSwarm(state) {

                // define metric arnd colour scale
                var metric = state.gender + "_" + state.variable,
                    c = d3.scaleLinear().domain([1, 52]).interpolate(d3.interpolateHcl).range([d3.rgb(state.c1), d3.rgb(state.c2)])

                // // add the axes
                // bsG.append("g")
                //   .attr("class", "x axis")
                //   .attr("transform", "translate(0," + bsH * state.placement + ")")
                //   .call(xAxis);

                // draw averages
                mAline.transition().duration(1000).ease(d3.easeExp)
                    .attr("x1", x(suppData["mat_" + state.variable + "avg"]))
                    .attr("x2", x(suppData["mat_" + state.variable + "avg"]))

                mAtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("x", x(suppData["mat_" + state.variable + "avg"])).text("AVG " + suppData["mat_" + state.variable + "avg"].toFixed(1));

                pAline.transition().duration(1000).ease(d3.easeExp)
                    .attr("x1", x(suppData["pat_" + state.variable + "avg"]))
                    .attr("x2", x(suppData["pat_" + state.variable + "avg"]))

                pAtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("x", x(suppData["pat_" + state.variable + "avg"])).text("AVG " + suppData["pat_" + state.variable + "avg"].toFixed(1));

                mMline.transition().duration(1000).ease(d3.easeExp)
                    .attr("x1", x(suppData["mat_" + state.variable + "med"]))
                    .attr("x2", x(suppData["mat_" + state.variable + "med"]))

                mMtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("x", x(suppData["mat_" + state.variable + "med"])).text("MEDIAN " + suppData["mat_" + state.variable + "med"].toFixed(1));

                pMline.transition().duration(1000).ease(d3.easeExp)
                    .attr("x1", x(suppData["pat_" + state.variable + "med"]))
                    .attr("x2", x(suppData["pat_" + state.variable + "med"]))

                pMtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("x", x(suppData["pat_" + state.variable + "med"])).text("MEDIAN " + suppData["pat_" + state.variable + "med"].toFixed(1));

                // run the force simulation to get new x and y values
                var simulation = d3.forceSimulation(state.data)
                    .force("x", d3.forceX(function(d) {
                        return x(d[metric]);
                    }).strength(1))
                    .force("y", d3.forceY(bsH * state.placement))
                    .force("collide", d3.forceCollide(r * 1.333))
                    .stop();

                for (var i = 0; i < 200; ++i) simulation.tick(); // increase this number to make it look better

                // draw (or redraw) a circle for each company
                var cc = bsG.selectAll(".companies" + state.gender)
                    .data(state.data, function(d) {
                        return d.company
                    })
                // remove the ones that aren't in the swarm anymore
                cc.exit()
                    .transition()
                    .duration(1000)
                    .ease(d3.easeExp)
                    .attr("cx", 0)
                    .attr("cy", bsH * state.placement)
                    .style("visibility", "hidden")
                    .remove();

                cc.enter()
                    .append("circle")
                    .attr("class", function(d) {
                        return "companies" + state.gender + " companies " + camelize(d.industry)
                    })
                    .attr("id", function(d) {
                        return camelize(d.company)
                    })
                    .attr("cx", 0)
                    .attr("cy", bsH * state.placement)
                    .attr("r", r)
                    .attr("fill", function(d) {
                        if (d[metric] < 1) {
                            return "#b5b5b5";
                        } else {
                            return c(d[metric])
                        }
                    })
                    .merge(cc)
                    .transition()
                    .duration(2500)
                    .ease(d3.easeExp)
                    .attr("cx", function(d) {
                        if (d[metric] > -1) {
                            return d.x
                        }
                    })
                    .attr("cy", function(d) {
                        if (d[metric] > -1) {
                            return d.y
                        }
                    })
                    .attr("fill", function(d) {
                        if (d[metric] < 1) {
                            return "#b5b5b5";
                        } else {
                            return c(d[metric])
                        }
                    });

                d3.selectAll(".companies").on("mouseover", bsTT.show).on("mouseout", bsTT.hide);

            } // end drawSwarm

            function drawAnnotations(status) {
                d3.selectAll(".bsAnnotation-group").remove();

                var wrap;
                if (small_screen) {
                    wrap = 120;
                } else if (medium_screen) {
                    wrap = 120;
                } else {
                    wrap = 240;
                }

                // annotations, thank you Susie Lu
                const type = d3.annotationLabel
                if (status === "paid") {
                    const bsAnnotations = [{
                            note: {
                                label: "Netflix allows for 52 weeks of paid leave for both parents, regardless of sex.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-end bsPaidAnnotation bsNetflixAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [-20, 30],
                                    [-35, 40]
                                ]
                            },
                            x: x(52) - 4,
                            y: bsH * .25 + 9,
                            dy: 55,
                            dx: -74
                        },
                        {
                            note: {
                                label: "The Bill and Melinda Gates Foundation also allows for 52 weeks paid parental leave, regardless of gender.",
                                // lineType: "none",
                                "align": "middle",
                                "orientation": "leftRight",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-end bsPaidAnnotation bsGatesAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [-20, -20],
                                    [-35, -28]
                                ]
                            },
                            x: x(52) - 4,
                            y: bsH * .75 - 3,
                            dy: -34,
                            dx: -74
                        }, {
                            note: {
                                label: "The majority of American companies allow for between 6 and 12 weeks maternity leave.",
                                "orientation": "leftRight",
                                "align": "bottom",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start bsPaidAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [(x(10) - x(8)) / 2, 15],
                                    [(x(10) - x(8)), 60]
                                ]
                            },
                            x: x(8),
                            y: bsH * .5 - 50,
                            dy: 60,
                            dx: x(10) - x(8)
                        },
                        {
                            note: {
                                label: "The average length of paid paternity leave offered by American companies is 4.5 weeks.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start bsPaidAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [20, 20],
                                    [35, 28]
                                ]
                            },
                            x: x(4.5),
                            y: bsH - 60,
                            dy: 34,
                            dx: 74
                        }
                    ]

                    const bsMakeAnnotations = d3.annotation()
                        .type(type)
                        .annotations(bsAnnotations);

                    bsG.append("g")
                        .attr("class", "bsAnnotation-group")
                        .call(bsMakeAnnotations);

                } else {
                    const bsAnnotations = [{
                            note: {
                                label: "Many of these companyies offer unpaid parental leave that can be split between two parents.",
                                // lineType: "none",
                                "align": "middle",
                                "orientation": "leftRight",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-end bsUnpaidAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [-20, -20],
                                    [-35, -28]
                                ]
                            },
                            x: x(26),
                            y: bsH * .75 - 40,
                            dy: -34,
                            dx: -74
                        }, {
                            note: {
                                label: "More companies are inclined to offer longer unpaid leave than paid.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start bsUnpaidAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [10, 5],
                                    [35, 10]
                                ]
                            },
                            x: x(12),
                            y: bsH * .5 - 55,
                            dy: -15,
                            dx: 80
                        },
                        {
                            note: {
                                label: "Often, American companies will offer 12 weeks unpaid parental leave to either/both parents.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start bsUnpaidAnnotation",
                            connector: {
                                type: "curve",
                                points: [
                                    [-8, -18],
                                    [-17, -28]
                                ]
                            },
                            x: x(12),
                            y: bsH - 215,
                            dy: -34,
                            dx: -50
                        }
                    ]

                    const bsMakeAnnotations = d3.annotation()
                        .type(type)
                        .annotations(bsAnnotations);

                    bsG.append("g")
                        .attr("class", "bsAnnotation-group")
                        .call(bsMakeAnnotations);

                }


                if (small_screen) d3.selectAll(".bsAnnotation-group").style("display", "none")
                d3.selectAll(".bsAnnotation-group").selectAll(".annotation-note-label").attr("y", 10)
            } // end annotations

            function resetSearch(ind, pay) {

                var searchData;
                searchData = data.filter(
                    function(d) {
                        var industryCheck,
                            payCheck;

                        if (ind == 'all') {
                            industryCheck = true;
                        } else {
                            industryCheck = (camelize(d.industry) == ind);
                        }

                        if (pay == 'paid') {
                            payCheck = ((d["mat_paid"] >= 1) || (d["pat_paid"] >= 1));
                        } else {
                            payCheck = ((d["mat_unpaid"] >= 1) || (d["pat_unpaid"] >= 1));
                        }

                        return industryCheck && payCheck;
                    }
                )

                bsSearch.selectAll(".searchoptions").remove();

                bsSearch.selectAll(".searchoptions")
                    .data(searchData.sort(function(a, b) {
                        return d3.ascending(a.company, b.company);
                    }))
                    .enter()
                    .append("option")
                    .attr("class", "searchoptions")
                    .attr("value", function(d) {
                        return camelize(d.company);
                    })
                    .text(function(d) {
                        return d.company
                    })
            }

        } // end beeswarm
        // draw everything
        //beeSwarm()

        function redrawBeeSwarm() {

            d3.select('#bsMetricSelectPaid').style('display', 'inline-block');
            d3.select('#bsMetricSelectUnpaid').style('display', 'inline-block');
            d3.select('#bsPayGenderSelectContainer').style('display', 'none');

            bsSVG.attr("width", bsW + swarmMargin.left + swarmMargin.right - 15)
                .attr("height", bsH + swarmMargin.top + swarmMargin.bottom),
                bsG.attr("transform", "translate(" + swarmMargin.left + "," + swarmMargin.top + ")");

            // draw labels/ticks
            bsG.select("#axisLabelStart").attr("x", x(0));
            bsG.select("#axisLabelEnd").attr("x", x(52));

            var bsTicks = [4, 8, 16, 32]
            for (var i = 0; i < bsTicks.length; i++) {
                bsG.select('#axisLabel' + i).attr("x", x(bsTicks[i]));
                bsG.select('#axisTickM' + i).attr("x1", x(bsTicks[i])).attr("x2", x(bsTicks[i]));
                bsG.select('#axisTickP' + i).attr("x1", x(bsTicks[i])).attr("x2", x(bsTicks[i]));
            }

            var xCoord,
                rectWidth;
            if (small_screen) {
                rectWidth = 200;
                rectHeight = 40;
            } else if (medium_screen) {
                rectWidth = 230;
                rectHeight = 44;
            } else {
                rectWidth = 260;
                rectHeight = 48;
            }

            if (windowW > 1300) {
                xCoord = bsW / 2;
            } else {
                xCoord = (2 * bsW) / 3;
            }

            bsG.selectAll(".chartTitle").attr("x", xCoord);
            bsG.selectAll('.backgroundRect').attr("x", xCoord - (rectWidth / 2)).attr('width', rectWidth).attr('height', rectHeight);

            bsG.select('.mbackgroundRect').attr('y', 15 - (rectHeight / 2));
            bsG.select('.pbackgroundRect').attr('y', bsH - 15 - (rectHeight / 2));

            drawAnnotations(status);
            drawSwarm(m);
            drawSwarm(p);

            function drawSwarm(state) {

                // define metric arnd colour scale
                var metric = state.gender + "_" + state.variable,
                    c = d3.scaleLinear().domain([1, 52]).interpolate(d3.interpolateHcl).range([d3.rgb(state.c1), d3.rgb(state.c2)])

                // // add the axes
                // bsG.append("g")
                //   .attr("class", "x axis")
                //   .attr("transform", "translate(0," + bsH * state.placement + ")")
                //   .call(xAxis);

                // draw averages
                mAline.attr("x1", x(suppData["mat_" + state.variable + "avg"]))
                    .attr("x2", x(suppData["mat_" + state.variable + "avg"]))

                mAtext.attr("x", x(suppData["mat_" + state.variable + "avg"])).text("AVG " + suppData["mat_" + state.variable + "avg"].toFixed(1));

                pAline.attr("x1", x(suppData["pat_" + state.variable + "avg"]))
                    .attr("x2", x(suppData["pat_" + state.variable + "avg"]))

                pAtext.attr("x", x(suppData["pat_" + state.variable + "avg"])).text("AVG " + suppData["pat_" + state.variable + "avg"].toFixed(1));

                mMline.attr("x1", x(suppData["mat_" + state.variable + "med"]))
                    .attr("x2", x(suppData["mat_" + state.variable + "med"]))

                mMtext.attr("x", x(suppData["mat_" + state.variable + "med"])).text("MEDIAN " + suppData["mat_" + state.variable + "med"].toFixed(1));

                pMline.attr("x1", x(suppData["pat_" + state.variable + "med"]))
                    .attr("x2", x(suppData["pat_" + state.variable + "med"]))

                pMtext.attr("x", x(suppData["pat_" + state.variable + "med"])).text("MEDIAN " + suppData["pat_" + state.variable + "med"].toFixed(1));

                // run the force simulation to get new x and y values
                var simulation = d3.forceSimulation(state.data)
                    .force("x", d3.forceX(function(d) {
                        return x(d[metric]);
                    }).strength(1))
                    .force("y", d3.forceY(bsH * state.placement))
                    .force("collide", d3.forceCollide(r * 1.333))
                    .stop();

                for (var i = 0; i < 200; ++i) simulation.tick(); // increase this number to make it look better

                // draw (or redraw) a circle for each company
                var cc = bsG.selectAll(".companies" + state.gender)
                    .data(state.data, function(d) {
                        return d.company
                    })
                    .attr("cx", function(d) {
                        if (d[metric] > -1) {
                            return d.x
                        }
                    })
                    .attr("cy", function(d) {
                        if (d[metric] > -1) {
                            return d.y
                        }
                    });

            } // end drawSwarm

            function drawAnnotations(status) {
                d3.selectAll(".bsAnnotation-group").remove();

                var wrap;
                if (small_screen) {
                    wrap = 120;
                } else if (medium_screen) {
                    wrap = 120;
                } else {
                    wrap = 200;
                }

                // annotations, thank you Susie Lu
                const type = d3.annotationLabel
                if (status === "paid") {
                    const bsAnnotations = [{
                            note: {
                                label: "Netflix allows for 52 weeks of paid leave for both parents, regardless of sex.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-end",
                            connector: {
                                type: "curve",
                                points: [
                                    [-20, 30],
                                    [-35, 40]
                                ]
                            },
                            x: x(52) - 4,
                            y: bsH * .25 + 9,
                            dy: 55,
                            dx: -74
                        },
                        {
                            note: {
                                label: "The Bill and Melinda Gates Foundation also allows for 52 weeks paid parental leave, regardless of gender.",
                                // lineType: "none",
                                "align": "middle",
                                "orientation": "leftRight",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-end",
                            connector: {
                                type: "curve",
                                points: [
                                    [-20, -20],
                                    [-35, -28]
                                ]
                            },
                            x: x(52) - 4,
                            y: bsH * .75 - 3,
                            dy: -34,
                            dx: -74
                        }, {
                            note: {
                                label: "The majority of American companies allow for between 6 and 12 weeks maternity leave.",
                                "orientation": "leftRight",
                                "align": "bottom",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start",
                            connector: {
                                type: "curve",
                                points: [
                                    [(x(10) - x(8)) / 2, 15],
                                    [(x(10) - x(8)), 60]
                                ]
                            },
                            x: x(8),
                            y: bsH * .5 - 50,
                            dy: 60,
                            dx: x(10) - x(8)
                        },
                        {
                            note: {
                                label: "The average length of paid paternity leave offered by American companies is 4.5 weeks.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start",
                            connector: {
                                type: "curve",
                                points: [
                                    [20, 20],
                                    [35, 28]
                                ]
                            },
                            x: x(4.5),
                            y: bsH - 60,
                            dy: 34,
                            dx: 74
                        }
                    ]

                    const bsMakeAnnotations = d3.annotation()
                        .type(type)
                        .annotations(bsAnnotations);

                    bsG.append("g")
                        .attr("class", "bsAnnotation-group")
                        .call(bsMakeAnnotations);

                } else {
                    const bsAnnotations = [{
                            note: {
                                label: "Many of these companyies offer unpaid parental leave that can be split between two parents.",
                                // lineType: "none",
                                "align": "middle",
                                "orientation": "leftRight",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-end",
                            connector: {
                                type: "curve",
                                points: [
                                    [-20, -20],
                                    [-35, -28]
                                ]
                            },
                            x: x(26),
                            y: bsH * .75 - 40,
                            dy: -34,
                            dx: -74
                        }, {
                            note: {
                                label: "More companies are inclined to offer longer unpaid leave than paid.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start",
                            connector: {
                                type: "curve",
                                points: [
                                    [10, 5],
                                    [35, 10]
                                ]
                            },
                            x: x(12),
                            y: bsH * .5 - 55,
                            dy: -15,
                            dx: 80
                        },
                        {
                            note: {
                                label: "Often, American companies will offer 12 weeks unpaid parental leave to either/both parents.",
                                orientation: "leftRight",
                                "align": "middle",
                                wrap: wrap
                            },
                            className: "adAnnotation bsAnnotation1 bsAnnotation-start",
                            connector: {
                                type: "curve",
                                points: [
                                    [-8, -18],
                                    [-17, -28]
                                ]
                            },
                            x: x(12),
                            y: bsH - 215,
                            dy: -34,
                            dx: -50
                        }
                    ]

                    const bsMakeAnnotations = d3.annotation()
                        .type(type)
                        .annotations(bsAnnotations);

                    bsG.append("g")
                        .attr("class", "bsAnnotation-group")
                        .call(bsMakeAnnotations);

                }


                if (small_screen) d3.selectAll(".bsAnnotation-group").style("display", "none")
                d3.selectAll(".bsAnnotation-group").selectAll(".annotation-note-label").attr("y", 10)
            } // end annotations
        } //end redraw beeswarm


        //DRAW SWARM MOBILE
        function beeSwarmMobile() {
            // remove all
            d3.selectAll(".beeswarm").remove();

            d3.select('#bsMetricSelectPaid').style('display', 'none');
            d3.select('#bsMetricSelectUnpaid').style('display', 'none');
            d3.select('#bsPayGenderSelectContainer').style('display', 'inline-block');

            bsSVG = d3.select("#beeswarm-container").append('svg')
                .classed('beeswarm', true)
                .attr("width", bsWMobile + swarmMarginMobile.left + swarmMarginMobile.right - 15)
                .attr("height", bsHMobile + swarmMarginMobile.top + swarmMarginMobile.bottom);

            bsG = bsSVG.append("g")
                .attr("transform", "translate(" + swarmMarginMobile.left + "," + swarmMarginMobile.top + ")"),
                formatNumber = d3.format(",");

            // draw average lines
            mAline = bsG.append("line").attr("class", "aLine").attr("x1", (0) + linemarginMobile).attr("x2", (bsWMobile) - linemarginMobile).attr("y1", y(suppData["mat_paidavg"])).attr("y2", y(suppData["mat_paidavg"])).style("stroke", matc1);

            mAtext = bsG.append("text").attr("class", "aText").attr("x", bsWMobile - linemarginMobile).attr("y", y(suppData["mat_paidavg"])).text("AVG " + suppData["mat_paidavg"].toFixed(1)).style("fill", matc1).style("text-anchor", "end").attr("dy", -4);

            pAline = bsG.append("line").attr("class", "aLine").attr("x1", (0) + linemarginMobile).attr("x2", (bsWMobile) - linemarginMobile).attr("y1", y(suppData["pat_paidavg"])).attr("y2", y(suppData["pat_paidavg"])).style("stroke", patc1);

            pAtext = bsG.append("text").attr("class", "aText").attr("x", bsWMobile - linemarginMobile).attr("y", y(suppData["pat_paidavg"])).text("AVG " + suppData["pat_paidavg"].toFixed(1)).style("fill", patc1).style("text-anchor", "end").attr("dy", -4);

            mMline = bsG.append("line").attr("class", "aLine").attr("x1", (0) + linemarginMobile).attr("x2", (bsWMobile) - linemarginMobile).attr("y1", y(suppData["mat_paidmed"])).attr("y2", y(suppData["mat_paidmed"])).style("stroke", matc1);

            mMtext = bsG.append("text").attr("class", "aText").attr("x", bsWMobile - linemarginMobile).attr("y", y(suppData["mat_paidmed"])).text("MEDIAN " + suppData["mat_paidmed"].toFixed(1)).style("fill", matc1).style("text-anchor", "end").attr("dy", -4);

            pMline = bsG.append("line").attr("class", "aLine").attr("x1", (0) + linemarginMobile).attr("x2", (bsWMobile) - linemarginMobile).attr("y1", y(suppData["pat_paidmed"])).attr("y2", y(suppData["pat_paidmed"])).style("stroke", patc1);

            pMtext = bsG.append("text").attr("class", "aText").attr("x", bsWMobile - linemarginMobile).attr("y", y(suppData["pat_paidmed"])).text("MEDIAN " + suppData["pat_paidmed"].toFixed(1)).style("fill", patc1).style("text-anchor", "end").attr("dy", -4);

            // draw labels/ticks
            bsG.append("text").attr("class", "axislabel").attr("id", "axisLabelStart").attr("x", linemarginMobile).attr("y", y(0)).text("0 weeks").attr("dy", 3);
            bsG.append("text").attr("class", "axislabel").attr("id", "axisLabelEnd").attr("x", linemarginMobile).attr("y", y(52)).text("52 weeks").attr("dy", 3);
            var bsTicks = [4, 8, 16, 32]
            for (var i = 0; i < bsTicks.length; i++) {
                bsG.append("text").attr("class", "axislabel").attr("id", "axisLabel" + i).attr("x", linemarginMobile).attr("y", y(bsTicks[i])).text(bsTicks[i] + " weeks").style("text-anchor", "start").attr("dy", -3);
                bsG.append("line").attr("class", "axisTick").attr("id", "axisTickM" + i).attr("x1", linemarginMobile).attr("x2", (bsWMobile) - linemarginMobile).attr("y1", y(bsTicks[i])).attr("y2", y(bsTicks[i]));
                bsG.append("line").attr("class", "axisTick").attr("id", "axisTickP" + i).attr("x1", linemarginMobile).attr("x2", (bsWMobile) - linemarginMobile).attr("y1", y(bsTicks[i])).attr("y2", y(bsTicks[i]));
            }
			
			/*
			var bsTT = d3.tip().attr('class', 'd3-tip').direction(function(d) {
				var top = false,
					bottom = false,
					left = false,
					right = false,
					swarmW = d3.select('.beeswarm').attr('width'),
					swarmH = d3.select('.beeswarm').attr('height')
				
				if (parseInt(this.cx.baseVal.value) < parseInt((swarmW / 2) - 20)) {
					left = true;
				} else {
					right = true;
				}
				
				if (parseInt(this.cy.baseVal.value) < parseInt((swarmH / 2))) {
					top = true;
				} else {
					bottom = true;
				}
				
				if (top && left) {
					return 'se';
				} else if (top && right) {
					return 'sw';	   
				} else if (bottom && left) {
					return 'ne';
				} else {
					return 'nw';
				}
			
			})
			*/

            // create tooltip and call using d3tip.js
            var bsTT = d3.tip().attr('class', 'd3-tip').direction('s').offset(function(d) {
				var cx = this.cx.baseVal.value;
				var swarmW = d3.select('.beeswarm').attr('width');
				var midpoint = swarmW / 2;
				var difference;
				var differenceLeftScale = d3.scaleLinear().domain([0, midpoint]).range([-80, 80]);
				var differenceRightScale = d3.scaleLinear().domain([0, midpoint]).range([0, -80]);
				var result;
				
				/*
				if (cx < midpoint) {
					difference = midpoint - cx;
					result = differenceLeftScale(difference);
				} else {
					difference = cx - midpoint;
					result = differenceRightScale(difference) * 2;
				}
				*/
				
				if (cx < midpoint) {
					return [0, 0];
				} else {
					return [0, -200];	   
				} 
			
			}).html(function(d) {
                var mpL = (d.mat_paid == -5) ? '—' : d.mat_paid,
                    muL = (d.mat_unpaid == -5) ? '—' : d.mat_unpaid,
                    ppL = (d.pat_paid == -5) ? '—' : d.pat_paid,
                    puL = (d.pat_unpaid == -5) ? '—' : d.pat_unpaid,
                    mpT = "",
                    muT = "",
                    ppT = "",
                    puT = "",
                    ind = "<strong>" + d.industry + "</strong><br>",
                    city = d.city + ", ",
                    state = d.state + ", ",
                    country = d.country;

                (mpL != '—') ? mpT = "<span class='weekAmountSubText tooltipWeeks matText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";
                (muL != '—') ? muT = "<span class='weekAmountSubText tooltipWeeks matText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";
                (ppL != '—') ? ppT = "<span class='weekAmountSubText tooltipWeeks patText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";
                (puL != '—') ? puT = "<span class='weekAmountSubText tooltipWeeks patText'>weeks</span>": "<span class='weekAmountSubText tooltipWeeks tooltipHiddenText'>_</span>";

                return "<div class='tooltip bs-tooltip'><p class='tooltip-header'>" + d.company + "</p><p class='tooltip-sub-header'>" + d.industry + "</p><div class='table-row table-header'><p class='first-cell flex-cell'></p><p class='second-cell flex-cell'>Paid</p><p class='third-cell flex-cell'>Unpaid</p></div><div class='table-row'><p class='first-cell flex-cell'>Maternity Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks matText'>" + mpL + "</span>" + mpT + "</div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks matText'>" + muL + "</span>" + muT + "</div></div><div class='table-row'><p class='first-cell flex-cell'>Paternity Leave</p><div class='second-cell flex-cell'><span class='weekAmount tooltipWeeks patText'>" + ppL + "</span>" + ppT + "</div><div class='third-cell flex-cell'><span class='weekAmount tooltipWeeks patText'>" + puL + "</span>" + puT + "</div></div></div>"
            });

            bsSVG.call(bsTT)
            bsSVG.on('click', function() {
                bsTT.hide;
            })

            var industry = 'all';

            // set up controls using select2.js
            //    industry filter
            $(".bsIndustrySelect").select2({
                placeholder: "Filter by Industry",
                allowClear: true,
                width: "150px"
            });
            $('.bsIndustrySelect').on("select2:select", industryselect);
            $('.bsIndustrySelect').on("select2:unselect", function() {
                industry = 'all';
                filterclear();
            });

            //    company search, will populate later
            $('.bsSearch').select2({ // company search
                placeholder: "Find a Company...",
                allowClear: true,
                width: "150px"
            });
            $('.bsSearch').on("select2:select", companysearch);
            $('.bsSearch').on("select2:unselect", filterclear);

            var bsSearch = d3.select(".bsSearch");
            bsSearch.append("option")
                .attr("value", "")
                .text("");

            function industryselect() {
                industry = $(this).val();
                $('.bsSearch').val(null).trigger('change');
                d3.selectAll(".companies").style("visibility", "hidden")
                d3.selectAll("." + industry).style("visibility", "visible").style("opacity", 1)

                d3.selectAll('.adAnnotation').style('visibility', 'hidden');

                if (status == 'paid' && gender == 'maternity') {
                    if (industry == 'other' || industry == 'technology') {
                        d3.select('.bsNetflixBillAnnotation').style('visibility', 'visible');
                    }
                }

                resetSearch(industry, status);

            }

            function companysearch() {
                var company = $(this).val();
                d3.selectAll(".companies").style("opacity", .15).style("stroke", "none").attr("r", r);
                d3.selectAll("#" + company).style("opacity", 1).style("stroke", "black").style("stroke-width", "1px").attr("r", 6);

                d3.selectAll('.adAnnotation').style('visibility', 'hidden');

                if (status == 'paid' && gender == 'maternity') {
                    if (company == 'billAndMelindaGatesFoundation' || company == 'netflix') {
                        d3.select('.bsNetflixBillAnnotation').style('visibility', 'visible');
                    }
                }
            }

            function filterclear() {
                d3.selectAll(".companies").style("visibility", "hidden").style("stroke", "none").attr("r", r);
                if (industry == 'all') {
                    d3.selectAll(".companies").style("visibility", "visible").style("opacity", 1);
                    d3.selectAll('.adAnnotation').style('visibility', 'visible');
                } else {
                    if (industry == 'other' || industry == 'technology') {
                        d3.select('.bsNetflixBillAnnotation').style('visibility', 'visible');
                    }
                    d3.selectAll("." + industry).style("visibility", "visible").style("opacity", 1);
                }
                resetSearch(industry, status);

            }

            hideLines(gender);
            drawSwarm(m);
            drawAnnotations(status);

            $("#bsPayGenderSelect").select2({
                allowClear: false,
                width: "150px",
                minimumResultsForSearch: 5
            });
            $('#bsPayGenderSelect').on("select2:select", function() {

                d3.selectAll(".companies").style("visibility", "visible").style("opacity", 1).style("stroke", "none").attr("r", r)

                var value = $(this).val(),
                    pay = value.charAt(0),
                    gen = value.charAt(1);

                if (pay == 'p') {
                    status = 'paid';
                } else {
                    status = 'unpaid';
                }

                m.variable = status;
                p.variable = status;

                if (status === "paid") {
                    m.data = data_mat_paid;
                    p.data = data_pat_paid;
                }
                if (status === "unpaid") {
                    m.data = data_mat_unpaid;
                    p.data = data_pat_unpaid;
                }

                industry = 'all';
                resetSearch(industry, status);

                if (gen == 'm') {
                    if (gender == 'paternity') {
                        d3.selectAll('.companies').remove();
                    }
                    gender = 'maternity';
                    hideLines(gender)
                    drawSwarm(m);
                } else {
                    if (gender == 'maternity') {
                        d3.selectAll('.companies').remove();
                    }
                    gender = 'paternity';
                    hideLines(gender)
                    drawSwarm(p);
                }
                drawAnnotations(status)
            });


            // populate the search
            resetSearch(industry, status);

            function drawSwarm(state) {

                // define metric arnd colour scale
                var metric = state.gender + "_" + state.variable,
                    c = d3.scaleLinear().domain([1, 52]).interpolate(d3.interpolateHcl).range([d3.rgb(state.c1), d3.rgb(state.c2)])

                // // add the axes
                // bsG.append("g")
                //   .attr("class", "x axis")
                //   .attr("transform", "translate(0," + bsH * state.placement + ")")
                //   .call(xAxis);

                // draw averages
                mAline.transition().duration(1000).ease(d3.easeExp)
                    .attr("y1", y(suppData["mat_" + state.variable + "avg"]))
                    .attr("y2", y(suppData["mat_" + state.variable + "avg"]))

                mAtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("y", y(suppData["mat_" + state.variable + "avg"])).text("AVG " + suppData["mat_" + state.variable + "avg"].toFixed(1));

                pAline.transition().duration(1000).ease(d3.easeExp)
                    .attr("y1", y(suppData["pat_" + state.variable + "avg"]))
                    .attr("y2", y(suppData["pat_" + state.variable + "avg"]))

                pAtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("y", y(suppData["pat_" + state.variable + "avg"])).text("AVG " + suppData["pat_" + state.variable + "avg"].toFixed(1));

                mMline.transition().duration(1000).ease(d3.easeExp)
                    .attr("y1", y(suppData["mat_" + state.variable + "med"]))
                    .attr("y2", y(suppData["mat_" + state.variable + "med"]))

                mMtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("y", y(suppData["mat_" + state.variable + "med"])).text("MEDIAN " + suppData["mat_" + state.variable + "med"].toFixed(1));

                pMline.transition().duration(1000).ease(d3.easeExp)
                    .attr("y1", y(suppData["pat_" + state.variable + "med"]))
                    .attr("y2", y(suppData["pat_" + state.variable + "med"]))

                pMtext.transition().duration(1000).ease(d3.easeExp)
                    .attr("y", y(suppData["pat_" + state.variable + "med"])).text("MEDIAN " + suppData["pat_" + state.variable + "med"].toFixed(1));

                // run the force simulation to get new x and y values
                var simulation = d3.forceSimulation(state.data)
                    .force("y", d3.forceY(function(d) {
                        return y(d[metric]);
                    }).strength(1))
                    .force("x", d3.forceX(bsWMobile / 2))
                    .force("collide", d3.forceCollide(r * 1.333))
                    .stop();

                for (var i = 0; i < 200; ++i) simulation.tick(); // increase this number to make it look better

                // draw (or redraw) a circle for each company
                var cc = bsG.selectAll(".companies" + state.gender)
                    .data(state.data, function(d) {
                        return d.company
                    })

                // remove the ones that aren't in the swarm anymore
                cc.exit()
                    .transition()
                    .duration(1000)
                    .ease(d3.easeExp)
                    .attr("cx", bsWMobile / 2)
                    .attr("cy", 0)
                    .style("visibility", "hidden")
                    .remove();

                cc.enter()
                    .append("circle")
                    .attr("class", function(d) {
                        return "companies" + state.gender + " companies " + camelize(d.industry)
                    })
                    .attr("id", function(d) {
                        return camelize(d.company)
                    })
                    .attr("cx", bsWMobile / 2)
                    .attr("cy", 0)
                    .attr("r", r)
                    .attr("fill", function(d) {
                        if (d[metric] < 1) {
                            return "#b5b5b5";
                        } else {
                            return c(d[metric])
                        }
                    })
                    .merge(cc)
                    .transition()
                    .duration(2500)
                    .ease(d3.easeExp)
                    .attr("cx", function(d) {
                        if (d[metric] > -1) {

                            return d.x
                        }
                    })
                    .attr("cy", function(d) {
                        if (d[metric] > -1) {
                            return d.y
                        }
                    })
                    .attr("fill", function(d) {
                        if (d[metric] < 1) {
                            return "#b5b5b5";
                        } else {
                            return c(d[metric])
                        }
                    });

                d3.selectAll(".companies").on("mouseover", bsTT.show).on("mouseout", bsTT.hide);

            } // end drawSwarm

            function drawAnnotations(status) {
                d3.selectAll(".bsAnnotation-group").remove();

                var wrap = 80;

                // annotations, thank you Susie Lu
                const type = d3.annotationLabel
                if (status === "paid" && gender === 'maternity') {
                    const bsAnnotations = [{
                        note: {
                            label: "Both Netflix and The Bill and Melinda Gates Foundation allow for 52 weeks of paid leave for both parents, regardless of sex.",
                            orientation: "leftRight",
                            "align": "middle",
                            wrap: wrap
                        },
                        className: "adAnnotation bsAnnotation1 bsAnnotation-end bsPaidAnnotation bsNetflixBillAnnotation",
                        connector: {
                            type: "curve",
                            points: [
                                [20, -15],
                                [35, -30]
                            ]
                        },
                        x: bsW / 2,
                        y: y(52) - 5,
                        dy: -50,
                        dx: 50
                    }]

                    const bsMakeAnnotations = d3.annotation()
                        .type(type)
                        .annotations(bsAnnotations);

                    bsG.append("g")
                        .attr("class", "bsAnnotation-group")
                        .call(bsMakeAnnotations);

                }

            } // end annotations

            function resetSearch(ind, pay) {

                var searchData;
                searchData = data.filter(
                    function(d) {
                        var industryCheck,
                            payCheck;

                        if (ind == 'all') {
                            industryCheck = true;
                        } else {
                            industryCheck = (camelize(d.industry) == ind);
                        }

                        if (pay == 'paid') {
                            payCheck = ((d["mat_paid"] >= 1) || (d["pat_paid"] >= 1));
                        } else {
                            payCheck = ((d["mat_unpaid"] >= 1) || (d["pat_unpaid"] >= 1));
                        }

                        return industryCheck && payCheck;
                    }
                )

                bsSearch.selectAll(".searchoptions").remove();

                bsSearch.selectAll(".searchoptions")
                    .data(searchData.sort(function(a, b) {
                        return d3.ascending(a.company, b.company);
                    }))
                    .enter()
                    .append("option")
                    .attr("class", "searchoptions")
                    .attr("value", function(d) {
                        return camelize(d.company);
                    })
                    .text(function(d) {
                        return d.company
                    })
            }

            function hideLines(g) {
                if (g == 'maternity') {
                    mAline.style('visibility', 'visible');
                    mAtext.style('visibility', 'visible');
                    pAline.style('visibility', 'hidden');
                    pAtext.style('visibility', 'hidden');
                    mMline.style('visibility', 'visible');
                    mMtext.style('visibility', 'visible');
                    pMline.style('visibility', 'hidden');
                    pMtext.style('visibility', 'hidden');
                } else if (g == 'paternity') {
                    mAline.style('visibility', 'hidden');
                    mAtext.style('visibility', 'hidden');
                    pAline.style('visibility', 'visible');
                    pAtext.style('visibility', 'visible');
                    mMline.style('visibility', 'hidden');
                    mMtext.style('visibility', 'hidden');
                    pMline.style('visibility', 'visible');
                    pMtext.style('visibility', 'visible');
                }

            }

        } // end beeswarm
        // draw everything

        function redrawBeeSwarmMobile() {

            d3.select('#bsMetricSelectPaid').style('display', 'none');
            d3.select('#bsMetricSelectUnpaid').style('display', 'none');
            d3.select('#bsPayGenderSelectContainer').style('display', 'inline-block');

            bsSVG.attr("width", bsWMobile + swarmMarginMobile.left + swarmMarginMobile.right - 15)
                .attr("height", bsHMobile + swarmMarginMobile.top + swarmMarginMobile.bottom),
                bsG.attr("transform", "translate(" + swarmMarginMobile.left + "," + swarmMarginMobile.top + ")");

            // draw labels/ticks
            bsG.select("#axisLabelStart").attr("x2", bsWMobile - linemarginMobile);
            bsG.select("#axisLabelEnd").attr("x2", bsWMobile - linemarginMobile);

            var bsTicks = [4, 8, 16, 32]
            for (var i = 0; i < bsTicks.length; i++) {
                bsG.select('#axisLabel' + i).attr("x2", bsWMobile - linemarginMobile);
                bsG.select('#axisTickM' + i).attr("x2", bsWMobile - linemarginMobile);
                bsG.select('#axisTickP' + i).attr("x2", bsWMobile - linemarginMobile);
            }

            if (gender == 'maternity') {
                drawSwarm(m);
            } else {
                drawSwarm(p);
            }

            drawAnnotations(status);

            function drawSwarm(state) {

                // define metric arnd colour scale
                var metric = state.gender + "_" + state.variable,
                    c = d3.scaleLinear().domain([1, 52]).interpolate(d3.interpolateHcl).range([d3.rgb(state.c1), d3.rgb(state.c2)])

                // // add the axes
                // bsG.append("g")
                //   .attr("class", "x axis")
                //   .attr("transform", "translate(0," + bsH * state.placement + ")")
                //   .call(xAxis);

                // draw averages
                mAline.attr("x2", (bsWMobile) - linemarginMobile)
                mAtext.attr("x", (bsWMobile) - linemarginMobile)
                pAline.attr("x2", (bsWMobile) - linemarginMobile)
                pAtext.attr("x", (bsWMobile) - linemarginMobile)
                mMline.attr("x2", (bsWMobile) - linemarginMobile)
                mMtext.attr("x", (bsWMobile) - linemarginMobile)
                pMline.attr("x2", (bsWMobile) - linemarginMobile)
                pMtext.attr("x", (bsWMobile) - linemarginMobile)

                // run the force simulation to get new x and y values
                var simulation = d3.forceSimulation(state.data)
                    .force("y", d3.forceY(function(d) {
                        return y(d[metric]);
                    }).strength(1))
                    .force("x", d3.forceX(bsWMobile / 2))
                    .force("collide", d3.forceCollide(r * 1.333))
                    .stop();

                for (var i = 0; i < 200; ++i) simulation.tick(); // increase this number to make it look better

                // draw (or redraw) a circle for each company
                var cc = bsG.selectAll(".companies" + state.gender)
                    .data(state.data, function(d) {
                        return d.company
                    })
                    .attr("cx", function(d) {
                        if (d[metric] > -1) {
                            return d.x
                        }
                    })
                    .attr("cy", function(d) {
                        if (d[metric] > -1) {
                            return d.y
                        }
                    });

            } // end drawSwarm

            function drawAnnotations(status) {
                d3.selectAll(".bsAnnotation-group").remove();

                var wrap = 80;

                // annotations, thank you Susie Lu
                const type = d3.annotationLabel
                if (status === "paid" && gender === 'maternity') {
                    const bsAnnotations = [{
                        note: {
                            label: "Both Netflix and The Bill and Melinda Gates Foundation allow for 52 weeks of paid leave for both parents, regardless of sex.",
                            orientation: "leftRight",
                            "align": "middle",
                            wrap: wrap
                        },
                        className: "adAnnotation bsAnnotation1 bsAnnotation-end bsPaidAnnotation bsNetflixBillAnnotation",
                        connector: {
                            type: "curve",
                            points: [
                                [20, -15],
                                [35, -30]
                            ]
                        },
                        x: bsW / 2,
                        y: y(52) - 5,
                        dy: -50,
                        dx: 50
                    }]

                    const bsMakeAnnotations = d3.annotation()
                        .type(type)
                        .annotations(bsAnnotations);

                    bsG.append("g")
                        .attr("class", "bsAnnotation-group")
                        .call(bsMakeAnnotations);

                }

            } // end annotations



        } //end redraw beeswarm

        if (small_screen) {
            beeSwarmMobile()
        } else {
            beeSwarm()
        }


        // on resize
        function resize() {
            if (bsWindowW != window.innerWidth) {
                windowW = window.innerWidth;
                bsWindowW = window.innerWidth;
                windowH = window.innerHeight;
                barControlHeight = $('.bsControl').height();

                large_screen = false;
                medium_screen = false;
                small_screen = false;

                if (windowW > 1000) {
                    large_screen = true;
                } else if (windowW > 763) {
                    medium_screen = true;
                } else {
                    small_screen = true;
                }

                // desktop setup
                bsW = windowW; // beeswarm width = full width
                bsW = bsW - swarmMargin.left - swarmMargin.right;

                x = d3.scaleLinear()
                    .rangeRound([0, bsW * .25, bsW * .5, bsW * .75, bsW])
                    .domain([0, 6.5, 13, 26, 52]),
                    xAxis = d3.axisBottom(x)
                    .ticks(20, ".0s")
                    .tickSizeOuter(0);

                // mobile setup
                bsWMobile = windowW; // beeswarm width = full width
                bsWMobile = bsWMobile - swarmMarginMobile.left - swarmMarginMobile.right;
                bsHMobile = (windowH * 1.6) - barControlHeight; // beeswarm height = full height
                bsHMobile = bsHMobile - swarmMarginMobile.top - swarmMarginMobile.bottom;

                y = d3.scaleLinear()
                    .rangeRound([0, bsHMobile * .25, bsHMobile * .5, bsHMobile * .75, bsHMobile])
                    .domain([0, 6.5, 13, 26, 52]),
                    yAxis = d3.axisLeft(y)
                    .tickSizeOuter(0);

                if (small_screen && !prev_mobile) {
                    beeSwarmMobile();
                    prev_mobile = true;
                } else if (!small_screen && prev_mobile) {
                    beeSwarm();
                    prev_mobile = false;
                } else if (small_screen && prev_mobile) {
                    redrawBeeSwarmMobile();
                    prev_mobile = true;
                } else if (!small_screen && !prev_mobile) {
                    redrawBeeSwarm();
                    prev_mobile = false;
                }
            }
        }

        window.addEventListener('resize', resize)

    }) // end data

    // to clean up company names for id tags
    function camelize(str) {
        return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '').replace("&", "and").replace(/,/g, "").replace(/'/g, "").replace("1800GOTJUNK?", "one800GotJunk").replace("15Five", "fifteenFive").replace("22squared", "twentytwoSquared").replace("270Strategies", "two70strategies").replace("2U", "twoU").replace("2k", "twoK").replace("3M", "threeM").replace("500friends", "fiveHundredFriends").replace("7Eleven", "sevenEleven").replace("72andsunny", "seventyTwoandSunny").replace("8451°", "eighty451degrees");
    }
})