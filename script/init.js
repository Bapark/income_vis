

d3.csv("data/H-8Median_household_Income_2017adjusted.csv").then(incomedata => {
    //console.log(incomedata);
   
});

d3.csv("data/highest_marginal_income_taxrates.csv").then(incomedata => {
    //console.log(incomedata);
   
});

//setup racial data sets 


async function loadRaceData(){
	let allRaces =  await d3.csv("data/h03AR.csv");

	let asiandata = await  d3.csv("data/h03A.csv");

	let blackdata = await  d3.csv("data/h03B.csv");

	let hispdata = await  d3.csv("data/h03H.csv");

	let whitedata = await  d3.csv("data/h03WNH.csv");

	let raceData = {
		overall : allRaces,
		asian : asiandata,
		black : blackdata,
		hispanic : hispdata,
		white : whitedata
	}

	console.log(raceData);

	let removeTopFiveFromHighest = function(dataSet) {
		dataSet.forEach(elem => {
			//formula to tease out average
			dataSet.highest = (4 * dataSet.highest + dataSet.top5)/3;
		});
	}
	removeTopFiveFromHighest(raceData.overall);
	removeTopFiveFromHighest(raceData.asian);
	removeTopFiveFromHighest(raceData.black);
	removeTopFiveFromHighest(raceData.hispanic);
	removeTopFiveFromHighest(raceData.white);
	
	//globalscope
	incomeTimePlot = new IncomeTimePlot(raceData);
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

loadRaceData();

//TODO construct view