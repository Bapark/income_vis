/**
 * Class for drawing line chart of income through the years
 */
class AggregateIncomeBarPlot {
    constructor(data) {
        //console.log(data);
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 875 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.data = data;

        this.colorScales = {};

        this.colorScales.overall = d3.scaleLinear().domain([1,5])
                                    .range([d3.rgb('#000000'), d3.rgb('#d3d3d3')]);
        this.colorScales.white = d3.scaleLinear().domain([1,5])
                                    .range([d3.rgb("#E51A00"), d3.rgb('#EECCC3')]);
        this.colorScales.black = d3.scaleLinear().domain([1,5])
                                    .range([d3.rgb("#0B3AE5"), d3.rgb('#ACBBEC')]);
        this.colorScales.asian = d3.scaleLinear().domain([1,5])
                                    .range([d3.rgb("#00A80F"), d3.rgb('#D4F4D2')]);
        this.colorScales.hispanic = d3.scaleLinear().domain([1,5])
                                    .range([d3.rgb("#7000A8"), d3.rgb('#EFDBF5')]);

        this.colorScales.top5 = 1;
        this.colorScales.fourth = 2;
        this.colorScales.third = 3;
        this.colorScales.second = 4;
        this.colorScales.lowest = 5;

        this.drawPlot();
    }

    drawPlot() { 
        this.svg = d3.select('#aggregateBarsDiv')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);

        let svgGroup = this.svg.append('g').classed('wrapper-group', true);

        //Text and axes skeleton
        svgGroup.append('g')
            .attr('id', 'x-axis-aggregatechart')
            .attr('transform', 'translate(' + this.margin.left + ',' + (this.height + this.margin.top) +')')
            .classed('axis', true);
        svgGroup.append('g')
            .attr('id', 'y-axis-aggregatechart')
            .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
            .classed('axis', true);
        svgGroup.append('text')
            .text('category'.toUpperCase())
            .attr('id', 'x-axis-label-aggregatechart')
            .classed('axis-label', true)
            .attr('transform', 'translate(' + (this.width/2 + this.margin.left) + ', ' + (this.height + this.margin.bottom) + ')');
        svgGroup.append('text')
            .text('Total Income Share (%)'.toUpperCase())
            .attr('id', 'y-axis-label-aggregatechart')
            .classed('axis-label', true)
            .attr('transform', 'translate(20, ' + (this.height * 0.60 + this.margin.bottom) + ') ' +
                               'rotate(-90)');
        
        this.xScale = d3.scaleBand()
            .domain(['Temp1', 'Temp2'])
            .range([0, this.width]);
        this.yScale = d3.scaleLinear()
            .domain([0, 300000])
            .range([this.height, 0])
            .nice();

        let xAxis = d3.axisBottom();
        let yAxis = d3.axisLeft();
        xAxis.scale(this.xScale);
        yAxis.scale(this.yScale)
            .ticks(10);
        d3.select('#x-axis-aggregatechart').call(xAxis);
        d3.select('#y-axis-aggregatechart').call(yAxis);
        
        this.barGroup = this.svg.append('g')
                    .attr('id', 'bar-group-aggregatechart');



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
        let paths = this.barGroup.selectAll('path')
                            .data(nextData);

        let pathsEnter = paths.enter().append('path');
        paths.exit().remove();
        paths = paths.merge(pathsEnter);

        let lineFn = d3.line()
                        .x((d) => that.xScale(new Date(d.year, 0, 1, 0)) + that.margin.left)
                        .y((d) => that.yScale(d.value) + that.margin.top);
        paths.attr('d', (d) => lineFn(d.data))
            .attr('stroke', (d) => {
                return that.colorScales[d.category](that.colorScales[d.pentile])}) //TODO add color scales
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        
       
    }

    drawPath(path, color) {

    }
}