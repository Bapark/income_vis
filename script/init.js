

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
	
	console.log(medianIncomeData);

	let incomeShareData = {};
	incomeShareData.overall = await d3.csv('data/h02AR.csv');
	incomeShareData.asian = await d3.csv('data/h02A.csv');
	incomeShareData.black = await d3.csv('data/h02B.csv');
	incomeShareData.hispanic = await d3.csv('data/h02H.csv');
	incomeShareData.white = await d3.csv('data/h02WNH.csv');

	//globalscope
	incomeTimePlot = new IncomeTimePlot(medianIncomeData);
	aggregateIncomeBarPlot = new AggregateIncomeBarPlot(incomeShareData);
	d3.selectAll('.sub-button').on('change', () => incomeTimePlot.updatePlot());
	d3.selectAll('.top-level-button').on('change', () => {
		let src = d3.event.originalTarget;
		d3.selectAll(`.${src.classList[1]}`)
			.nodes()
			.forEach((elem) => {
				elem.checked = src.checked;
			});
		incomeTimePlot.updatePlot();
	});
}

loadData();

//TODO construct view