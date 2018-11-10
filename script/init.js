

d3.csv("data/H-8Median_household_Income_2017adjusted.csv").then(incomedata => {
    console.log(incomedata);
   
});


//setup racial data sets 


async function loadRaceData(){
	let allRaces =  await d3.csv("data/h01AR.csv");

	let asiandata = await  d3.csv("data/h01A.csv");

	let blackdata = await  d3.csv("data/h01B.csv");

	let hispdata = await  d3.csv("data/h01H.csv");

	let whitedata = await  d3.csv("data/h01WNH.csv");

	let raceData = {
		Overall : allRaces,
		Asian : asiandata,
		Black : blackdata,
		Hispanic : hispdata,
		White : whitedata
	}

	
	//globalscope
	incomeTimePlot = new IncomeTimePlot(raceData);
	let subboxes = document.getElementsByClassName('sub-button');
	
	
	d3.selectAll('.sub-button').on('change', incomeTimePlot.updatePlot);
	d3.selectAll('.top-level-button').on('change', incomeTimePlot.updatePlot);
	


}

loadRaceData();

//TODO construct view