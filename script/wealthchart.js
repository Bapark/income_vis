class WealthChart {
	constructor(data){
		this.wealthData = data;
		this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 600 - this.margin.top - this.margin.bottom;

        this.pie = d3.pie()
						.value((d)=>{return d.percent})
						.sort(null)
						.padAngle(.02);

		this.outerRad = 220;
		this.innerRad = 150;
		let tenPercentScale = d3.scaleLinear()
			.domain([1,5])
			.range([d3.rgb(' #4d4d33'), d3.rgb('#adad85')]);
		this.color = function(i) {
			if(i < 1) {
				return '#3366ff';
			}
			return tenPercentScale(i);
		}
		
		
		//d3.scaleOrdinal(d3.schemeCategory10);
        this.drawChart();
        
	}

	drawChart(){

		
		let sliderVal = document.getElementById("slider").value;
		d3.select('#wealthYear').text(sliderVal);
		let defData = this.wealthData.filter( (d)=>{return d.year == sliderVal});

		let dataArray = [
	    	{ name: "Bottom 90%", percent: defData[0].bottom_90  },
	    	{ name: "90-95%", percent: defData[0]["90-95"] },
	    	{ name: "95-99%", percent: defData[0]["95-99"]  },
	    	{ name: "99-99.5%", percent: defData[0]["99-99.5"]  },
	    	{ name: "99.5-99.9%", percent: defData[0]["99.5-99.9"]  },
	    	{ name: "99.9-99.99%", percent: defData[0]["99.9-99.99"]  }
		];


		let that = this;

		let svg = d3.select('#wealthChart').append('svg')
			.attr('width',this.width)
			.attr('height',this.height)
			.attr('id', 'wealthSvg')
			.append('g').attr('transform','translate('+ this.width/2 +',' + this.height/2 +')');

	
		let arc = d3.arc().outerRadius(this.outerRad).innerRadius(this.innerRad);

		let path = svg.selectAll('path')
			.data(this.pie(dataArray))
			.enter()
			.append('path')
			.attr('d',arc)
			.attr('fill',(d,i) => that.color(i));
		
		 let text=svg.selectAll('text')
        	.data(this.pie(dataArray))
        	.enter()
        	.append("text")
        	.attr("transform", function (d) {
        	    return "translate(" + arc.centroid(d) + ")";
        	})
        	.attr("dy", ".4em")
        	.attr("text-anchor", "middle")
        	.text(d => d3.format(".0%")(d.data.percent/100))

        	.style({
        	    fill:'#fff',
        	    'font-size':'10px'
        	});
        
        	let legendRectSize=20;
    		let legendSpacing=7;
    		let legendHeight=legendRectSize+legendSpacing;
 		
 		
    		

    		d3.select('#wealthSvg').append('g').attr('id', 'legendWrap');
    		let legWrap = d3.select('#legendWrap').attr('transform', 'translate(' + (this.width/2  -10) + ','+ (this.height/2 - 5) +')');

    		legWrap.selectAll('rect').data(dataArray).enter().append('rect')
    			.classed('legend', true)
    		    .attr('transform', (d,i) => { return 'translate(-35,' + ((i*legendHeight)-65) + ')'; })
    		    .attr('width', legendRectSize)
    			.attr('height', legendRectSize)
    			.attr('rx', 20)
    			.attr('ry', 20)
    			.attr('style',  (d,i)=>{ return 'fill:' + that.color(i) +';' + 'stroke:' + that.color(i) +';'});;

    		legWrap.selectAll('text').data(dataArray).enter().append('text')
    			.classed('legendText', true)
    			.attr('transform', (d,i) => { return 'translate(-10,' + ((i*legendHeight)-50) + ')'; })
    			.text((d)=>{return d.name;});

	}

	updateChart(){
		let that = this;
		let sliderVal = document.getElementById("slider").value;
		d3.select('#wealthYear').text(sliderVal);
		let defData = that.wealthData.filter( (d)=>{
			return d.year == sliderVal
		});
		let svg = d3.select('#wealthSvg');
		let dataArray = [
	    	{ name: "bottom_90", percent: defData[0].bottom_90  },
	    	{ name: "90-95", percent: defData[0]["90-95"] },
	    	{ name: "95-99", percent: defData[0]["95-99"]  },
	    	{ name: "99-99.5", percent: defData[0]["99-99.5"]  },
	    	{ name: "99.5-99.9", percent: defData[0]["99.5-99.9"]  },
	    	{ name: "99.9-99.99", percent: defData[0]["99.9-99.99"]  }
		];

		

		let arc = d3.arc().outerRadius(this.outerRad).innerRadius(this.innerRad);

		let path = svg.selectAll('path');
		path.data(this.pie(dataArray));
		path.transition().duration(100).attrTween('d', function(a){
			let i = d3.interpolate(this._current, a);
			return arc(i())
		})
		let penter = path.enter()
			.append('path');
			

		let text= svg.select('g').selectAll('text')
        	.data(this.pie(dataArray))
        	.attr("transform", function (d) {
        	    return "translate(" + arc.centroid(d) + ")";
        	})
        	.attr("dy", ".4em")
        	.attr("text-anchor", "middle")
        	.text(d => d3.format(".0%")(d.data.percent/100));


		path.exit().remove()

		
		path = path.merge(penter);
		path.attr('d',arc);
	}


}