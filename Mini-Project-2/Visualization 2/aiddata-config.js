
function getVis2ChartConfig() {
	let width = 1500;
	let height = 900;
	let margin = {
		top: 20,
		bottom: 20,
		left: 250,
		right: 30
	}
	let bodyHeight = height - margin.top - margin.bottom
	let bodyWidth = width - margin.left - margin.right

	let container = d3.select("#Vis2Chart")
	
	container
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)

	return { width, height, margin, bodyHeight, bodyWidth, container }
}
