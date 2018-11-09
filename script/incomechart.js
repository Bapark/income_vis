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
        /*
         You will be setting up the plot for the scatterplot.
         Here you will create axes for the x and y data that you will be selecting and calling in updatePlot
         (hint): class them.

         Main things you should set up here:
         1). Create the x and y axes
         2). Create the activeYear background text


         The dropdown menus have been created for you!

         */         
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
            .text('x-axis-label'.toUpperCase())
            .attr('id', 'x-axis-label')
            .classed('axis-label', true)
            .attr('transform', 'translate(' + (this.width/2 + this.margin.left) + ', ' + (this.height + this.margin.bottom) + ')');
        svgGroup.append('text')
            .text('y-axis-label'.toUpperCase())
            .attr('id', 'y-axis-label')
            .classed('axis-label', true)
            .attr('transform', 'translate(10, ' + (this.height/2 + this.margin.bottom) + ') ' +
                               'rotate(-90)');

    }
}