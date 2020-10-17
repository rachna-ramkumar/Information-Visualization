let store = {}

function loadData() {
	return Promise.all([
		d3.csv("aiddata-countries-only.csv"),
	]).then(datasets => {
		store.aiddata = datasets[0]
		console.log("Loaded AidData dataset")
		return store;
	})
}

function groupByCountryArray(data) {
	let result = data.reduce((result, d) => {
		let currentDonor = result[d.donor] || {
			"Country": d.donor,
			"YearlyNetAmounts": {}
		}
		if (!currentDonor.YearlyNetAmounts[d.year]) {
			currentDonor.YearlyNetAmounts[d.year] = {
				"Year": d.year,
				"Amount": 0.0
			}
		}
		currentDonor.YearlyNetAmounts[d.year].Amount -= parseInt(d.commitment_amount_usd_constant)
		result[d.donor] = currentDonor

		let currentRecipient = result[d.recipient] || {
			"Country": d.recipient,
			"YearlyNetAmounts": {}
		}
		if (!currentRecipient.YearlyNetAmounts[d.year]) {
			currentRecipient.YearlyNetAmounts[d.year] = {
				"Year": d.year,
				"Amount": 0
			}
		}
		currentRecipient.YearlyNetAmounts[d.year].Amount += parseInt(d.commitment_amount_usd_constant)
		result[d.recipient] = currentRecipient
	
	return result;
	},{})

	// Convert to array
	result = Object.keys(result).map(key => result[key])
	result.sort((a, b) => {
		let totalCountryNetA = Object.keys(a.YearlyNetAmounts).reduce(function (previous, key) {
			return previous + a.YearlyNetAmounts[key].Amount;
		}, 0)

		let totalCountryNetB = Object.keys(b.YearlyNetAmounts).reduce(function (previous, key) {
			return previous + b.YearlyNetAmounts[key].Amount;
		}, 0)

		return d3.ascending(totalCountryNetA, totalCountryNetB) // sorting by country name
	})

	// clean up years
	for (c in result) {
		for (i = 1973; i < 2014; i++) {
			if (!result[c].YearlyNetAmounts[i]) {
				result[c].YearlyNetAmounts[i] = {
					"Year": i.toString(),
					"Amount": 0
				}
			}
		}
		result[c].YearlyNetAmounts = Object.keys(result[c].YearlyNetAmounts).map(key => result[c].YearlyNetAmounts[key])
	}

  	return result
}

function groupByPurpose(data) {
	let result = data.reduce((result, d) => {
		let currentPurpose = result[d.coalesced_purpose_name] || {
			"Purpose": d.coalesced_purpose_name,
			"TotalAmount": 0,
			"YearlyDonations": {}
		}
		if (!currentPurpose.YearlyDonations[d.year]) {
			currentPurpose.YearlyDonations[d.year] = {
				"Year": d.year,
				"Amount": 0
			}
		}
		currentPurpose.YearlyDonations[d.year].Amount += parseInt(d.commitment_amount_usd_constant)
		currentPurpose.TotalAmount += parseInt(d.commitment_amount_usd_constant)
		result[d.coalesced_purpose_name] = currentPurpose
		return result
	},{})

	// Convert to array
	result = Object.keys(result).map(key => result[key])
	result.sort((a, b) => {
		return d3.descending(a.TotalAmount,b.TotalAmount)
	})
  return result
}

function groupByYearlyPercentages(purposes) {
	yearlyTotal = {} // total donated from top 10 purposes
	years = []
	for (i = 1973; i < 2014; i++) {
		let currentSum = 0
		for (p in purposes) {
			if (purposes[p].YearlyDonations[i]) {
				currentSum += purposes[p].YearlyDonations[i].Amount
			}
		}
		yearlyTotal[i] =
		{
			"TotalFromTop10":currentSum
		}
	}
	//console.log(yearlyTotal)
	purposes.forEach(function(purpose) {
		for (y in purpose.YearlyDonations) {
			purpose.YearlyDonations[y].Amount = purpose.YearlyDonations[y].Amount/yearlyTotal[y].TotalFromTop10
		}
	})
	for (i = 1973; i < 2014; i++) {
		let year = {
			"year":i
		}
		for (p in purposes) {
			if (purposes[p].YearlyDonations[i]) {
				year[purposes[p].Purpose] = purposes[p].YearlyDonations[i].Amount
			} else {
				year[purposes[p].Purpose] = 0
			}
		}
		years.push(year)
	}
	//console.log(years)
	return years
}

function groupByJapanRecipients(data) {
	let result = data.reduce((result, d) => {
		let currentCountry = result[d.recipient] || {
			"Country": d.recipient,
			"TotalAmount": 0,
			"YearlyDonations": {}
		}
		if (!currentCountry.YearlyDonations[d.year]) {
			currentCountry.YearlyDonations[d.year] = {
				"Year": d.year,
				"Amount": 0
			}
		}
		currentCountry.YearlyDonations[d.year].Amount += parseInt(d.commitment_amount_usd_constant)
		currentCountry.TotalAmount += parseInt(d.commitment_amount_usd_constant)
		if (d.donor == "Japan") { // Only add to map if donation is from Japan
			result[d.recipient] = currentCountry
		}
		return result
	},{})

	// Convert to array
	result = Object.keys(result).map(key => result[key])
	result.sort((a, b) => {
		return d3.descending(a.TotalAmount,b.TotalAmount)
	})
  return result
}