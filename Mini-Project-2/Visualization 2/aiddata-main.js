function processData() {
	// load data
	let aiddata = store.aiddata
	// process data
	let countriesList = groupByCountryArray(aiddata)
	let purposesVolume = groupByPurpose(aiddata)
	let topPurposes = purposesVolume.slice(0,10)
	let yearlyPurposesPercent = groupByYearlyPercentages(topPurposes)
	let japanRecipients = groupByJapanRecipients(aiddata)
	console.log("Vis 2 - Top 10 purposes with yearly donations: ",topPurposes)
	// load configs
	let config2 = getVis2ChartConfig()
	// draw charts
	drawVis2Chart(yearlyPurposesPercent, config2)
}

loadData().then(processData);