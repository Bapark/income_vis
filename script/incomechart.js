/**
 * Wrapper class for data that goes in the plot
 */
class PlotData {
    constructor() {

    }
}

class IncomeTimePlot {
    constructor(data) {
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.data = data;
        this.drawPlot();

    }

    drawPlot() {
       
          
        this.svg = d3.select('#incomeLineDiv')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        let svgGroup = this.svg.append('g').classed('wrapper-group', true);

        //Text and axes skeleton
        svgGroup.append('text')
            .text(this.activeYear)
            .attr('id', 'year-label')
            .classed('activeYear-background', true)
            .attr('transform', 'translate(' + (this.width/4) + ', ' + (this.height/4) + ')');
        svgGroup.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.height + this.margin.top) +')')
            .classed('axis', true);
        svgGroup.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
            .classed('axis', true);
        svgGroup.append('text')
            .text('year'.toUpperCase())
            .attr('id', 'x-axis-label')
            .classed('axis-label', true)
            .attr('transform', 'translate(' + (this.width/2 + this.margin.left) + ', ' + (this.height + this.margin.bottom) + ')');
        svgGroup.append('text')
            .text('USD (2017)'.toUpperCase())
            .attr('id', 'y-axis-label')
            .classed('axis-label', true)
            .attr('transform', 'translate(10, ' + (this.height/2 + this.margin.bottom) + ') ' +
                               'rotate(-90)');
        
        this.xScale = d3.scaleTime()
            .domain([new Date(1960, 0, 1, 0), new Date(2018, 0, 1, 0)])
            .range([0, this.width])
            .nice();
        this.yScale = d3.scaleLinear()
            .domain([0, 300000])
            .range([this.height, 0])
            .nice();

        let xAxis = d3.axisBottom();
        let yAxis = d3.axisLeft();
        xAxis.scale(this.xScale);
        yAxis.scale(this.yScale)
            .ticks(10);
        d3.select('#x-axis').call(xAxis);
        d3.select('#y-axis').call(yAxis);   

    }

    updatePlot() {
        let checked = document.querySelectorAll('input[class=sub-button]:checked');
        console.log(checked);
        let checks = document.getElementsByClassName('sub-button');
    }

    drawPath(path, color) {

    }
}