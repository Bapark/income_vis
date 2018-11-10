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



        this.updatePlot();

    }

    updatePlot() {
        let that = this;
        let checked = document.querySelectorAll('input[class=sub-button]:checked');
        let checks = document.getElementsByClassName('sub-button');

        let majorBoxes = d3.selectAll('.top-level-button');

        let nextData = {}; //TODO build data to draw lines based on what is checked

        majorBoxes.each(function(){
            
            let thisbox = d3.select(this);

            if(thisbox.property('checked')){
               let parent = d3.select(this.parentNode);
               let buttons = parent.selectAll('.sub-button');

               buttons.each(function(){
                //if this equals 
               
                    let box = d3.select(this);
                    if(box.property('checked')){
                        if(box.classed('overall')){
                            //add overall data line
                            if(box.attr('id')  === "overall-top5" ){
                                //set data to top
                            }
                            else if(box.attr('id')  === "overall-fourth" ){

                            }
                             else if(box.attr('id')  === "overall-third" ){
                                
                            }
                             else if(box.attr('id')  === "overall-second" ){
                                
                            }
                             else if(box.attr('id')  === "overall-first" ){
                                
                            }


                        }
                        else if(box.classed('asian')){
                             //add overall data line
                            if(box.attr('id')  === "asian-top5" ){
                                //set data to top
                            }
                            else if(box.attr('id')  === "asian-fourth" ){

                            }
                             else if(box.attr('id')  === "asian-third" ){
                                
                            }
                             else if(box.attr('id')  === "asian-second" ){
                                
                            }
                             else if(box.attr('id')  === "asian-first" ){
                                
                            }
                        }
                        else if(box.classed('black')){
                             //add overall data line
                            if(box.attr('id')  === "black-top5" ){
                                //set data to top
                            }
                            else if(box.attr('id')  === "black-fourth" ){

                            }
                             else if(box.attr('id')  === "black-third" ){
                                
                            }
                             else if(box.attr('id')  === "black-second" ){
                                
                            }
                             else if(box.attr('id')  === "black-first" ){
                                
                            }
                        }
                        else if(box.classed('hispanic')){
                             //add overall data line
                            if(box.attr('id')  === "hispanic-top5" ){
                                //set data to top
                            }
                            else if(box.attr('id')  === "hispanic-fourth" ){

                            }
                             else if(box.attr('id')  === "hispanic-third" ){
                                
                            }
                             else if(box.attr('id')  === "hispanic-second" ){
                                
                            }
                             else if(box.attr('id')  === "hispanic-first" ){
                                
                            }
                        }
                        else if(box.classed('white')){
                             //add overall data line
                            if(box.attr('id')  === "white-top5" ){
                                //set data to top
                            }
                            else if(box.attr('id')  === "white-fourth" ){

                            }
                             else if(box.attr('id')  === "white-third" ){
                                
                            }
                             else if(box.attr('id')  === "white-second" ){
                                
                            }
                             else if(box.attr('id')  === "white-first" ){
                                
                            }
                        }
                    }
               })
            }
        })





    }

    drawPath(path, color) {

    }
}