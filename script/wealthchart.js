class WealthChart {
	constructor(data){
		this.wealthData = data;
		this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 875 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.drawChart();

	}

	drawChart(){

		let sliderVal = document.getElementById("slider").value;
		let defData = this.wealthData.filter( (d)=>{return d.year == sliderVal});

		let dataArray = [
	    	{ name: "90-95", percent: defData[0]["90-95"] },
	    	{ name: "95-99", percent: defData[0]["95-99"]  },
	    	{ name: "99-99.5", percent: defData[0]["99-99.5"]  },
	    	{ name: "99.5-99.9", percent: defData[0]["99.5-99.9"]  },
	    	{ name: "99.9-99.99", percent: defData[0]["99.9-99.99"]  },
	    	{ name: "bottom_90", percent: defData[0].bottom_90  }
		];



		let pie = d3.pie()
						.value((d)=>{return d.percent}) //TODO set correct data
						.sort(null)
						.padAngle(.02);

		let svg = d3.select('#wealthChart').append('svg')
			.attr('width',this.width)
			.attr('height',this.height)
			.append('g').attr('transform','translate('+ this.width/2 +',' + this.height/2 +')');

		let outerRad = this.width/2;
		let innerRad = 120;

		let arc = d3.svg.arc().outerRadius(outerRad).innerRadius(innerRad);

		let arcs = pie(dataArray);

		let path = svg.selectAll('path')
			.data(pie(this.data))
			.enter()
			.append('path')
			.attr({
				d:arc,
				fill: function(d,i){
					return color(d.data.name); //TODO ensure this is correct
				}
			});



		//todo set transition

	}

	updateChart(){

	}


}