

d3.csv("data/H-8Median_household_Income_2017adjusted.csv").then(incomedata => {
    //console.log(incomedata);
   
});

d3.csv("data/highest_marginal_income_taxrates.csv").then(incomedata => {
    //console.log(incomedata);
   
});

//setup racial data sets 
async function loadData(){

	let medianIncomeData = {};
	medianIncomeData.overall =  await d3.csv("data/h03AR.csv");
	medianIncomeData.asian = await  d3.csv("data/h03A.csv");
	medianIncomeData.black = await  d3.csv("data/h03B.csv");
	medianIncomeData.hispanic = await  d3.csv("data/h03H.csv");
	medianIncomeData.white = await  d3.csv("data/h03WNH.csv");
	
	let removeTopFiveFromHighest = function(dataSet) {
		dataSet.forEach(elem => {
			//formula to tease out average
			dataSet.highest = (4 * dataSet.highest + dataSet.top5)/3;
		});
	}
	removeTopFiveFromHighest(medianIncomeData.overall);
	removeTopFiveFromHighest(medianIncomeData.asian);
	removeTopFiveFromHighest(medianIncomeData.black);
	removeTopFiveFromHighest(medianIncomeData.hispanic);
	removeTopFiveFromHighest(medianIncomeData.white);

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