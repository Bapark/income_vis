class WealthChart {
	constructor(data){
		this.wealthData = data;
		this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 875 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;

        this.drawChart();

	}

	drawChart(){
		let pie = d3.layout.pie()
						.value((d)=>{}) //TODO set correct data
						.sort(null)
						.padAngle(.02);

		let svg = d3.select('#wealthChart').append('svg')
			.attr({width:this.width, height:this.height})
			.append('g').attr({transform:'translate('+ this.width/2 +',' + this.height/2 +')'});

		let outerRad = this.width/2;
		let innerRad = 120;

		let arc = d3.svg.arc().outerRadius(outerRad).innerRadius(innerRad);

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