/**
 * Class for drawing line chart of income through the years
 */
class AggregateIncomeBarPlot {
    constructor(data) {
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 875 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.data = data;
        this.reducedData = {};
        for(let race in this.data) {
            this.reducedData[race] = this.data[race].reduce((accum, curr) => {
                for(let category in curr){
                    if(category == 'year' || category == 'number'){
                        continue;
                    }
                    accum[category] += curr[category];
                }
                return accum;
            });
        }

        this.colorScales = {};
        this.colorScales.overall = d3.scaleLinear().domain([1,6])
                                    .range([d3.rgb('#000000'), d3.rgb('#d3d3d3')]);
        this.colorScales.white = d3.scaleLinear().domain([1,6])
                                    .range([d3.rgb("#E51A00"), d3.rgb('#EECCC3')]);
        this.colorScales.black = d3.scaleLinear().domain([1,6])
                                    .range([d3.rgb("#0B3AE5"), d3.rgb('#ACBBEC')]);
        this.colorScales.asian = d3.scaleLinear().domain([1,6])
                                    .range([d3.rgb("#00A80F"), d3.rgb('#D4F4D2')]);
        this.colorScales.hispanic = d3.scaleLinear().domain([1,6])
                                    .range([d3.rgb("#7000A8"), d3.rgb('#EFDBF5')]);

        this.colorScales.top5 = 1;
        this.colorScales.highest = 2;
        this.colorScales.fourth = 3;
        this.colorScales.third = 4;
        this.colorScales.second = 5;
        this.colorScales.lowest = 6;

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
            .domain([0, 1600])
            .range([this.height, 0])
            .nice();

        this.xAxis = d3.axisBottom();
        this.yAxis = d3.axisLeft();
        this.xAxis.scale(this.xScale);
        this.yAxis.scale(this.yScale)
            .ticks(10);
        d3.select('#x-axis-aggregatechart').call(this.xAxis);
        d3.select('#y-axis-aggregatechart').call(this.yAxis);
        
        this.barGroup = this.svg.append('g')
                    .attr('id', 'bar-group-aggregatechart');



        this.updatePlot();

    }

    updatePlot() {
        let that = this;
        let checked = document.querySelectorAll('input.sub-button:checked');

        let nextData = [];
        let bands = [];

        checked.forEach((elem) => {
            let arr = elem.id.split('-');
            bands.push(`${arr[0].toUpperCase()} ${arr[1].toUpperCase()}`);
            
            let d = {};
            d.value = this.reducedData[arr[0]][arr[1]];
            d.category = arr[0];
            d.pentile = arr[1];
            nextData.push(d);
        });

        this.xScale = d3.scaleBand()
        .domain(bands)
        .range([0, this.width])
        .paddingInner(0.05);
        this.xAxis = d3.axisBottom().scale(this.xScale);
        d3.select('#x-axis-aggregatechart').call(this.xAxis);
        
        let bars = this.barGroup.selectAll('rect')
                            .data(nextData);

        let barsEnter = bars.enter().append('rect');
        bars.exit().remove();
        bars = bars.merge(barsEnter);


        bars.attr('fill', (d) => {
                return that.colorScales[d.category](that.colorScales[d.pentile])}) //TODO add color scales
            .attr('width', this.xScale.bandwidth())
            .attr('height', (d) => this.height - this.yScale(d.value))
            .attr('x', (d) => this.xScale(`${d.category.toUpperCase()} ${d.pentile.toUpperCase()}`))
            .attr('y', (d) => this.yScale(d.value));
        this.barGroup
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    drawPath(path, color) {

    }
}