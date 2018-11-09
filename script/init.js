

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
		AllRace : allRaces,
		Asian : asiandata,
		Black : blackdata,
		Hispanic : hispdata,
		White : whitedata
	}

	console.log(raceData);
	new IncomeTimePlot(raceData);

}

loadRaceData();

//TODO construct view