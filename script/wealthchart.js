class WealthChart {
	constructor(data){
		this.wealthData = data;
		this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 875 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.pie = d3.pie()
						.value((d)=>{return d.percent}) //TODO set correct data
						.sort(null)
						.padAngle(.02);

		this.outerRad = 180;
		this.innerRad = 120;

        this.drawChart();
        
	}

	drawChart(){

		
		let sliderVal = document.getElementById("slider").value;
		d3.select('#wealthYear').text(sliderVal);
		let defData = this.wealthData.filter( (d)=>{return d.year == sliderVal});

		let dataArray = [
	    	{ name: "90-95", percent: defData[0]["90-95"] },
	    	{ name: "95-99", percent: defData[0]["95-99"]  },
	    	{ name: "99-99.5", percent: defData[0]["99-99.5"]  },
	    	{ name: "99.5-99.9", percent: defData[0]["99.5-99.9"]  },
	    	{ name: "99.9-99.99", percent: defData[0]["99.9-99.99"]  },
	    	{ name: "bottom_90", percent: defData[0].bottom_90  }
		];


		let color  = d3.scaleOrdinal(d3.schemeCategory10);
		

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
			.attr('fill',function(d,i){
					return color(d.data.name); 
				});
		
		let that = this;
        

		//todo set transition

	}

	updateChart(){

/*
		function arcTween(a) {
  			let i = d3.interpolate(this._current, a);
  			this._current = i(0);
  			return function(t) {
   				return arc(i(t));
  			};
		}
*/
		let that = this;
		let sliderVal = document.getElementById("slider").value;
		d3.select('#wealthYear').text(sliderVal);
		let defData = that.wealthData.filter( (d)=>{
			return d.year == sliderVal
		});
		let svg = d3.select('#wealthSvg');
		let dataArray = [
	    	{ name: "90-95", percent: defData[0]["90-95"] },
	    	{ name: "95-99", percent: defData[0]["95-99"]  },
	    	{ name: "99-99.5", percent: defData[0]["99-99.5"]  },
	    	{ name: "99.5-99.9", percent: defData[0]["99.5-99.9"]  },
	    	{ name: "99.9-99.99", percent: defData[0]["99.9-99.99"]  },
	    	{ name: "bottom_90", percent: defData[0].bottom_90  }
		];

		

		let arc = d3.arc().outerRadius(this.outerRad).innerRadius(this.innerRad);

		let path = svg.selectAll('path');
		path.data(this.pie(dataArray));

		let penter = path.enter()
			.append('path');
			

		path.exit().remove()

		path = path.merge(penter);
		path
			.attr('d',arc)
			.attr('fill',function(d,i){
				return color(d.data.name); 
			});

			//.transition().duration(750).attrTween("d", arcTween);;


	}


}