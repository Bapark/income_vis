if(!Array.prototype.last){
	Array.prototype.last = function(){
		return this[this.length - 1];
	}
}

d3.csv("data/H-8Median_household_Income_2017adjusted.csv").then(incomedata => {
    //console.log(incomedata);
   
});

d3.csv("data/highest_marginal_income_taxrates.csv").then(incomedata => {
    //console.log(incomedata);
   
});

//setup racial data sets 
async function loadData(){

	let medianIncomeData = {};
	let incomeFormatter = function(data){
		let val =  {
			year : parseInt(data.year),
			lowest : parseInt(data.lowest),
			second : parseInt(data.second),
			third : parseInt(data.third),
			fourth : parseInt(data.fourth),
			highest : parseInt(data.highest),
			top5 : parseInt(data.top5)
		};

		val.highest = (4 * val.highest - val.top5) / 3;
		return val;
	}
	medianIncomeData.overall =  await d3.csv("data/h03AR.csv", incomeFormatter)
	medianIncomeData.asian = await  d3.csv("data/h03A.csv", incomeFormatter);
	medianIncomeData.black = await  d3.csv("data/h03B.csv", incomeFormatter);
	medianIncomeData.hispanic = await  d3.csv("data/h03H.csv", incomeFormatter);
	medianIncomeData.white = await  d3.csv("data/h03WNH.csv", incomeFormatter);

	let incomeShareData = {};
	let aggregateFormater = function(data){
		let val = {
			year : parseInt(data.year),
			number : parseInt(data.number),
			lowest : parseFloat(data.lowest),
			second : parseFloat(data.second),
			third :  parseFloat(data.third),
			fourth : parseFloat(data.fourth),
			highest :parseFloat(data.highest),
			top5 :   parseFloat(data.top5)
		};
		val.highest = val.highest - val.top5;
		return val;
	}
	incomeShareData.overall = await d3.csv('data/h02AR.csv', aggregateFormater);
	incomeShareData.asian = await d3.csv('data/h02A.csv', aggregateFormater);
	incomeShareData.black = await d3.csv('data/h02B.csv', aggregateFormater);
	incomeShareData.hispanic = await d3.csv('data/h02H.csv', aggregateFormater);
	incomeShareData.white = await d3.csv('data/h02WNH.csv', aggregateFormater);

	//globalscope
	incomeTimePlot = new IncomeTimePlot(medianIncomeData);
	aggregateIncomeBarPlot = new AggregateIncomeBarPlot(incomeShareData);
	d3.selectAll('.sub-button').on('change', () => {
		incomeTimePlot.updatePlot();
		aggregateIncomeBarPlot.updatePlot();
	});
	d3.selectAll('.top-level-button').on('change', () => {
		let src = d3.event.originalTarget;
		d3.selectAll(`.${src.classList[1]}`)
			.nodes()
			.forEach((elem) => {
				elem.checked = src.checked;
			});
		incomeTimePlot.updatePlot();
		aggregateIncomeBarPlot.updatePlot();
	});


	//load wealth
	let wealthFormater = function(data) {
		let val = {
			year : parseInt(data.year),
			bottom_90 : parseFloat(data.bottom90),
			top_10 : parseFloat(data.top10),
			top_5 : parseFloat(data.top5),
			top_1 :  parseFloat(data.top1),
			top_0_5 : parseFloat(data.top0_5),
			top_0_1 :parseFloat(data.top0_1),
			top_0_01 :   parseFloat(data.top0_01)
		};
		//Precalculate bins
		val['90-95'] = val.top_10 - val.top_5;
		val['95-99'] = val.top_5 - val.top_1;
		val['99-99.5'] = val.top_1 - val.top_0_5;
		val['99.5-99.9'] = val.top_0_5 - val.top_0_1;
		val['99.9-99.99'] = val.top_0_1 - val.top_0_01;
		
		return val;
	}
	let wealthData = await d3.csv('data/wealthdata.csv', wealthFormater);
	console.log(wealthData);
	wealthChart = new WealthChart(wealthData);

	let yearSlider = d3.select('#slider');
	yearSlider.on('input', function() {
		aggregateIncomeBarPlot.updatePlot();
		wealthChart.updateChart();
	});

}

loadData();

//TODO construct view