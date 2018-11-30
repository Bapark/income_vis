/**
 * Class for drawing line chart of income through the years
 */
class IncomeTimePlot {
    constructor(data, colorScales) {
        this.margin = { top: 20, right: 120, bottom: 60, left: 80 };
        this.width = 700 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.data = data;

        this.colorScales = colorScales;

        this.drawPlot();
    }

    drawPlot() {
        this.svg = d3.select('#incomeLineDiv')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        this.div = d3.select('body')
            .append('div')
            .attr('class', 'tooltip hidden');
            
        //create the brush
        this.brush = d3.brush()
                .extent([[0, 0], [this.width - 25, this.height]]);
        this.svg.append('g')
            .attr('id', 'income-chart-brush')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .attr('class', 'brush')
            .call(this.brush);
            
        let svgGroup = this.svg.append('g').classed('wrapper-group', true);

        //Text and axes skeleton
        svgGroup.append('g')
            .attr('id', 'x-axis-incomechart')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.height + this.margin.top) +')')
            .classed('axis', true);
        svgGroup.append('g')
            .attr('id', 'y-axis-incomechart')
            .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
            .classed('axis', true);
        svgGroup.append('text')
            .text('year'.toUpperCase())
            .attr('id', 'x-axis-label-incomechart')
            .classed('axis-label', true)
            .classed('text', true)
            .attr('transform', 'translate(' + (this.width/2 + this.margin.left) + ', ' + (this.height + this.margin.bottom) + ')');
        svgGroup.append('text')
            .text('USD (2017)'.toUpperCase())
            .attr('id', 'y-axis-label-incomechart')
            .classed('axis-label', true)
            .attr('transform', 'translate(20, ' + (this.height/2 + this.margin.bottom) + ') ' +
                               'rotate(-90)');
        this.povertyline = svgGroup.append('g')
            .append('path')
            .attr('id', 'poverty-line-line')
            .attr('stroke', '#e6e6e6')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
        
        this.lineGroup = this.svg.append('g')
                    .attr('id', 'line-group-incomechart');

        this.legendGroup = this.svg.append('g')
                            .attr('id', 'legend-group')
                            .attr('transform', `translate(${this.margin.left + this.width - 15}, 5)`);

        //Create the group to display wealth gap
        this.wealthGroup = this.svg.append('g')
            .attr('id', 'income-chart-wealth-gap-data')
            .attr('transform', `translate(${this.margin.left + 15}, ${this.margin.top + 60})`);

        this.setupScales(1967, 2017, 0, 500000);
        this.updatePlot();
    }

    updatePlot() {
        let that = this;
        let checked = document.querySelectorAll('input.sub-button:checked');

        let nextData = [];

        checked.forEach((elem) => {
            let arr = elem.id.split('-');

            let d = {};
            d.data = that.data[arr[0]].map(elem => {
                return { 
                            'value': parseInt(elem[arr[1]]),
                            'year' : parseInt(elem.year)
                        };
            });
            d.category = arr[0];
            d.pentile = arr[1];
            nextData.push(d);
        });

        //Get min/max x and y values
        let minX = d3.min(nextData, (d) => {
            return d.data.last().year;
        });
        let minY = d3.min(nextData, (d) => {
            return d3.min(d.data, (d) => {
                return d.value;
            });
        });
        let maxY = d3.max(nextData, (d) => {
            return d3.max(d.data, (d) => {
                return d.value;
            });
        });

        //Set up new scales
        maxY = maxY > 25000 ? maxY : 25000; //clamp max y so the poverty line shows up
        this.setupScales(minX, 2017, minY, maxY);

        let paths = this.lineGroup.selectAll('path')
                            .data(nextData);

        let pathsEnter = paths.enter().append('path');
        paths.exit().remove();
        paths = paths.merge(pathsEnter);

        let lineFn = d3.line()
                        .x((d) => that.xScale(d.year) + that.margin.left)
                        .y((d) => that.yScale(d.value) + that.margin.top)
                        .curve(d3.curveStep);
        paths.attr('d', (d) => lineFn(d.data))
            .attr('stroke', (d) => {
                return that.colorScales[d.category](that.colorScales[d.pentile])})
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('id', (d) => `${d.category}-${d.pentile}-line`);
        
        //construct the legend
        if(minY < 24600) {
            nextData.push({
                'category' : 'poverty',
                'pentile' : 'line',
                'data' : [] //dummy data for brush
            });
        }
        let legendGroups = this.legendGroup.selectAll('g')
            .data(nextData);
        let legendGroupsEnter = legendGroups.enter().append('g');
        legendGroups.exit().remove();
        legendGroups = legendGroups.merge(legendGroupsEnter);
        legendGroups.selectAll('*').remove();

        legendGroups.append('circle')
                .attr('r', 5)
                .attr('fill', (d) => that.colorScales[d.category](that.colorScales[d.pentile]));
        legendGroups.attr('transform', (d, i) => {
            return `translate(5, ${i * 15 + 10})`;
        });

        legendGroups.append('text')
            .attr('transform', 'translate(15, 5)')
            .text(d => `${d.category.toUpperCase()} ${d.pentile.toUpperCase()}`)
            .classed('text', true)
            .classed('legend-text', true);
        
        //setup hovers
        let setHighlight = function(val) {
            return function(d) {
                d3.select(`#${d.category}-${d.pentile}-line`)
                .classed('highlighted', val);
            }
        }
        let setTooltip = function(val) {
            return function(d) {		
                that.div	
                .classed('hidden', !val);
                if(val) {
                    let coordinates = d3.mouse(this);
                    let year = Math.floor(that.xScale.invert(coordinates[0] - that.margin.left));
                    let medianIncome = Math.floor(that.yScale.invert(coordinates[1] - that.margin.top));
                    that.div.html(`<p class='tooltip-text'>${d.category.toUpperCase()} ${d.pentile.toUpperCase()} <br> Year : ${year} <br> Median Income ${medianIncome}`)	
                        .style("left", (d3.event.pageX) + "px")		
                        .style("top", (d3.event.pageY - 28) + "px");	
                }
                setHighlight(val)(d);
            }
        }
        legendGroups.on('mouseenter', setHighlight(true))
            .on('mouseleave', setHighlight(false));
        paths.on('mouseenter', setTooltip(true))
            .on('mouseleave', setTooltip(false));
        this.legendGroup.attr('transform', `translate(${this.margin.left + this.width - 15}, ${this.height/2 - 7.5 * nextData.length})`);

        //update brush callback
        this.brush
            .on('end', () => {
                if(d3.event.selection && nextData.length > 1) {
                    let startYear = Math.ceil(that.xScale.invert(d3.event.selection[0][0]));
                    let endYear = Math.floor(that.xScale.invert(d3.event.selection[1][0]));
                    let maxY = Math.ceil(that.yScale.invert(d3.event.selection[0][1]));
                    let minY = Math.floor(that.yScale.invert(d3.event.selection[1][1]));

                    //Order if necessary
                    if(startYear > endYear) {
                        let tmp = startYear;
                        startYear = endYear;
                        endYear = tmp;
                    }
                    if(minY > maxY) {
                        let tmp = minY;
                        minY = maxY
                        maxY = tmp;
                    }

                    //Get all intersecting lines
                    let idx = 2017 - startYear;
                    let intersections = [];
                    for(let i = 0; i < nextData.length; i++) {
                        if(idx < nextData[i].data.length && idx >= 0) {
                            if(nextData[i].data[idx].value <= maxY && nextData[i].data[idx].value >= minY) {
                                intersections.push(nextData[i]);
                            }
                        }
                    }
                    if(intersections.length < 2) {
                        return;
                    }
                    //Find the min and max lines
                    let minLine = intersections[0];
                    let maxLine = intersections[0];
                    for(let i = 1; i < intersections.length; i++) {
                        let minLineVal = minLine.data[idx].value;
                        let maxLineVal = maxLine.data[idx].value;
                        let currVal = intersections[i].data[idx].value;

                        if(currVal < minLineVal) {
                            minLine = intersections[i];
                        }

                        if(currVal > maxLineVal) {
                            maxLine = intersections[i];
                        }
                    }

                    let totalWealthGap = 0;
                    let end = 2017 - endYear;
                    end = end > 0 ? end : 0;
                    for(let i = idx; i >= end; i--) {
                        totalWealthGap += maxLine.data[i].value - minLine.data[i].value;
                    }

                    let wealthGapData = ["Total Wealth Gap Between", 
                                        `${maxLine.category.capFirst()} ${maxLine.pentile.capFirst()} \
                                         and ${minLine.category.capFirst()} ${minLine.pentile.capFirst()}`,
                                        `${startYear} - ${endYear}`,
                                        `${d3.format("($,.2f")(totalWealthGap)}`];

                    let wealthText = that.wealthGroup.selectAll('text')
                        .data(wealthGapData);
                    let wealthTextEnter = wealthText.enter().append('text');
                    wealthText.exit().remove();
                    wealthText = wealthText.merge(wealthTextEnter);

                    wealthText.attr('class', 'legend-text')
                        .attr('y', (d, i) => i * 20)
                        .text(d => d);
                } else {
                    this.wealthGroup.selectAll('*').remove();
                }
            });

    }

    setupScales(minX, maxX, minY, maxY) {
        this.xScale = d3.scaleLinear()
            .domain([minX, maxX])
            .range([0, this.width])
            .nice();
        this.yScale = d3.scaleLinear()
            .domain([minY, maxY])
            .range([this.height, 0])
            .nice();

        this.xAxis = d3.axisBottom();
        this.yAxis = d3.axisLeft();
        this.xAxis.scale(this.xScale)
            .tickFormat(d3.format(""));
        this.yAxis.scale(this.yScale)
                .ticks(10)
                .tickFormat(d3.format("$,"))
        d3.select('#x-axis-incomechart').call(this.xAxis);
        d3.select('#y-axis-incomechart').call(this.yAxis);

        //draw povertyline
        let povertyY = this.yScale(24600) + this.margin.top;
        if(minY < 24600 && maxY > 24600) {
            this.povertyline
                .attr('d', 
                    `M ${this.margin.left} ${povertyY} L ${this.width + this.margin.left - 25} ${povertyY}`);
        } else {
            this.povertyline
                .attr('d', '');
        }
    }
}