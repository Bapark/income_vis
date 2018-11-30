if(!Array.prototype.last){
	Array.prototype.last = function(){
		return this[this.length - 1];
	}
}

if(!String.prototype.capFirst) {
	String.prototype.capFirst = function() {
		if(this.lenght == 0) return this;
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
}

d3.csv("data/H-8Median_household_Income_2017adjusted.csv").then(incomedata => {
    //console.log(incomedata);
   
});

d3.csv("data/highest_marginal_income_taxrates.csv").then(incomedata => {
    //console.log(incomedata);
   
});

function createColorScales() {
	let colorScales = {};
	colorScales.overall = d3.scaleLinear().domain([1,6])
		//.interpolate(d3.interpolateHcl)
		.range([d3.rgb('#805e00'), d3.rgb('#ffe499')]);
	colorScales.white = d3.scaleLinear().domain([1,6])
		//.interpolate(d3.interpolateHcl)
		.range([d3.rgb("#800f00"), d3.rgb('#ff7866')]);
	colorScales.black = d3.scaleLinear().domain([1,6])
		//.interpolate(d3.interpolateHcl)
		.range([d3.rgb("#072592"), d3.rgb('#6d8bf8')]);
	colorScales.asian = d3.scaleLinear().domain([1,6])
		//.interpolate(d3.interpolateHcl)
		.range([d3.rgb("#008000"), d3.rgb('#80ff80')]);
	colorScales.hispanic = d3.scaleLinear().domain([1,6])
		//.interpolate(d3.interpolateHcl)
		.range([d3.rgb("#550080"), d3.rgb('#d580ff')]);
	colorScales.poverty = function() {
		return '#e6e6e6';
	}

	colorScales.top5 = 1;
	colorScales.highest = 2;
	colorScales.fourth = 3;
	colorScales.third = 4;
	colorScales.second = 5;
	colorScales.lowest = 6;

	return colorScales;
}

//setup racial data sets 
async function loadData(){
	let colorScales = createColorScales();
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
	incomeTimePlot = new IncomeTimePlot(medianIncomeData, colorScales);
	aggregateIncomeBarPlot = new AggregateIncomeBarPlot(incomeShareData, colorScales);
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
	let incomeSlider = d3.select('#incomeSlider');
	incomeSlider.on('input', function(){
		aggregateIncomeBarPlot.updatePlot();
	});
	yearSlider.on('input', function() {		
		wealthChart.updateChart();
	});
	yearSlider.attr('style', 'width: 25%;');

	let incomeCards = await d3.json('data/incomecards.json');
	let incomePresentationSideEffect = function (idx) {
		//Update Selections
		let topButtons = document.getElementsByClassName('top-level-button');
		for(let i = 0; i < topButtons.length; i++){
			topButtons[i].checked = true;
			topButtons[i].click();
		}
		incomeCards.cards[idx].buttons.forEach((elem) => {
			document.getElementById(elem)
				.click();
		});
	}
	let incomePresentation = new Presentation(incomeCards.cards, 
								'#income-presentation-title', 
								'#income-presentation-text-div',
								incomePresentationSideEffect);
	d3.select('#income-presentation-forward-button')
		.on('click', () => incomePresentation.moveNext());
	d3.select('#income-presentation-reverse-button')
		.on('click', () => incomePresentation.movePrevious());

	let wealthCards = await d3.json('data/wealthcards.json');
	let wealthPresentationSideEffect = function (idx) {
		yearSlider.node().value = wealthCards.cards[idx].year;
		yearSlider.node().dispatchEvent(new Event('input'));
	}
	let wealthPresentation = new Presentation(wealthCards.cards,
											'#wealth-presentation-title',
											'#wealth-presentation-text-div',
											wealthPresentationSideEffect);
	d3.select('#wealth-presentation-forward-button')
		.on('click', () => wealthPresentation.moveNext());
	d3.select('#wealth-presentation-reverse-button')
		.on('click', () => wealthPresentation.movePrevious());
	console.log(yearSlider.node());
}

loadData();

//TODO construct view