/**
 * Class for drawing line chart of income through the years
 */
class AggregateIncomeBarPlot {
    constructor(data, colorScales) {
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 700 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.header = d3.select('#aggregateHeader');
        this.data = data;
        this.reducedData = {};
        for(let race in this.data) {
            this.reducedData[race] = this.data[race].map((curr) => {
                let tmp = {
                    year : curr.year
                };
                for(let category in curr){
                    let factor = 1;
                    switch (category) {
                        case 'year' :
                        case 'number' :
                            continue;
                        case 'lowest' :
                        case 'second' :
                        case 'third' :
                        case 'fourth' :
                            factor = 1 / 20;
                            break;
                        case 'highest' :
                            factor = 1 / 15;
                            break;
                        case 'top5' :
                            factor = 1 /5;
                            break;
                    }
                    tmp[category] = curr[category] * factor * 1000;
                }
                return tmp;
            }); 
        }

        this.colorScales = colorScales;

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
            .attr('transform', 'translate(' + (this.width/2 + this.margin.left) + ', ' + (this.height + this.margin.bottom + 10) + ')');
        svgGroup.append('text')
            .text('Share of $10,000'.toUpperCase())
            .attr('id', 'y-axis-label-aggregatechart')
            .classed('axis-label', true)
            .attr('transform', 'translate(20, ' + (this.height * 0.60 + this.margin.bottom) + ') ' +
                               'rotate(-90)');
        
        this.xScale = d3.scaleBand()
            .domain(['Temp1', 'Temp2'])
            .range([0, this.width]);
        this.yScale = d3.scaleLinear()
            .domain([0, 5000])
            .range([this.height, 0])
            .nice();

        this.xAxis = d3.axisBottom();
        this.yAxis = d3.axisLeft();
        this.xAxis.scale(this.xScale);
        this.yAxis.scale(this.yScale)
            .ticks(10)
            .tickFormat(d3.format("$,"));
        d3.select('#x-axis-aggregatechart').call(this.xAxis);
        d3.select('#y-axis-aggregatechart').call(this.yAxis);
        
        this.barGroup = this.svg.append('g')
                    .attr('id', 'bar-group-aggregatechart');



        this.updatePlot();

    }

    updatePlot() {
        let year = document.getElementById("incomeSlider").value;
        this.header.text(`Income Shares ${year}`);
        let that = this;
        let checked = document.querySelectorAll('input.sub-button:checked');

        let nextData = [];
        let bands = [];

        checked.forEach((elem) => {
            let arr = elem.id.split('-');
            bands.push(`${arr[0].toUpperCase()} ${arr[1].toUpperCase()}`);
            
            let idx = 2017 - year;
            let d = {};
            d.value =  idx < this.reducedData[arr[0]].length ? 
                    this.reducedData[arr[0]][idx][arr[1]] : 0;
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
                return that.colorScales[d.category](that.colorScales[d.pentile])})
            .attr('width', this.xScale.bandwidth())
            .attr('height', (d) => this.height - this.yScale(d.value))
            .attr('x', (d) => this.xScale(`${d.category.toUpperCase()} ${d.pentile.toUpperCase()}`))
            .attr('y', (d) => this.yScale(d.value));
        bars.selectAll('title').remove();
        bars.append('title')
            .text(d => `${d3.format("$,.2f")(d.value)}`);
        this.barGroup
            .attr('transform', `translate(${this.margin.left + 1}, ${this.margin.top})`);

        var insertLinebreaks = function (abbreviate) {
            return function(d) {
                var el = d3.select(this);
                var words = d.split(' ');
                el.text('');
            
                for (var i = 0; i < words.length; i++) {
                    if(abbreviate) {
                        switch(words[i]) {
                            case 'WHITE' : words[i] = 'W'; break;
                            case 'HISPANIC' : words[i] = 'H'; break;
                            case 'BLACK' : words[i] = 'B'; break;
                            case 'ASIAN' : words[i] = 'A'; break;
                            case 'OVERALL' : words[i] = 'OA'; break;
                            case 'TOP5' : words[i] = 'T5'; break;
                            case 'HIGHEST' : words[i] = 'HI'; break;
                            case 'FOURTH' : words[i] = 'FTH'; break;
                            case 'THIRD' : words[i] = 'THD'; break;
                            case 'SECOND' : words[i] = 'SND'; break;
                            case 'LOWEST' : words[i] = 'LOW'; break;
                        }
                    }
                    var tspan = el.append('tspan').text(words[i]);
                    if (i > 0)
                        tspan.attr('x', 0).attr('dy', '15');
                }
            }
        };
        
        if(nextData.length > 7) {
            this.svg.selectAll('#x-axis-aggregatechart g text').each(insertLinebreaks(nextData.length > 10));
        }
    }

}