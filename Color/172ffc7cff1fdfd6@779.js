import define1 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["population-2018-2019.csv",new URL("./files/18e58346b5d3a52c4e301e25fbe613316a9e21fd4c76d0c1eea3d5dc537322c3f8928fe0074754c3d6bff498f4bec3d2a32928aa1db8f138b18ce8a6c6034253",import.meta.url)],["gz_2010_us_040_00_20m.json",new URL("./files/5bffca711a2b45090494c77bab30bfa36859ecb5a0619c7d93e1da8f8089be61df96021c578b53cfbd2c3f6611e2567183fec5ed9a66876b50bb47123b2c56b9",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Color - Exercise

In this exercise, we have created visualizations that do not have any color. Your task is to add appropriate color to them.

The [Color Legend](/@d3/color-legend) notebook imported below contains examples of how to make various color scales and their legends. I recommend looking at that notebook and the links it gives.`
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  main.import("swatches", child1);
  main.variable(observer()).define(["md","companies"], function(md,companies){return(
md`## Problem 1

First, we have a line chart that shows the stock prices for ${companies.length} companies: ${companies.join(', ')}.`
)});
  main.variable(observer("stocksByCompany")).define("stocksByCompany", ["datasets","d3","minStockDate"], async function(datasets,d3,minStockDate)
{
  const stocks = (await datasets['stocks.csv']())
    .map(d => ({
      'symbol': d.symbol,
      'price': d.price,
      'date': d3.timeParse('%b %e %Y')(d.date)
    }))
    .filter(d => d.date >= minStockDate)

  return Array.from(d3.group(stocks, d => d.symbol),
                    ([symbol, prices]) => ({symbol, prices}))
}
);
  main.variable(observer("companies")).define("companies", ["stocksByCompany"], function(stocksByCompany){return(
stocksByCompany.map(d => d.symbol)
)});
  main.variable(observer("minStockDate")).define("minStockDate", ["d3"], function(d3){return(
d3.timeParse('%b %e %Y')('Jan 1 2005')
)});
  main.variable(observer("maxStockDate")).define("maxStockDate", ["d3","stocksByCompany"], function(d3,stocksByCompany){return(
d3.max(stocksByCompany, d => d3.max(d.prices, p => p.date))
)});
  main.variable(observer("maxPrice")).define("maxPrice", ["d3","stocksByCompany"], function(d3,stocksByCompany){return(
d3.max(stocksByCompany, d => d3.max(d.prices, p => p.price))
)});
  main.variable(observer()).define(["legen"], function(legen){return(
legen()
)});
  main.variable(observer()).define(["width","d3","DOM","minStockDate","maxStockDate","maxPrice","stocksByCompany","color"], function(width,d3,DOM,minStockDate,maxStockDate,maxPrice,stocksByCompany,color)
{
  const margin = { top: 10, right: 30, bottom: 20, left: 40 };
  const visWidth = width - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;

  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3
    .scaleTime()
    .domain([minStockDate, maxStockDate])
    .range([0, visWidth]);

  const y = d3
    .scaleLinear()
    .domain([0, maxPrice])
    .nice()
    .range([visHeight, 0]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  g.append('g')
    .attr('transform', `translate(0,${visHeight})`)
    .call(xAxis);

  g.append('g')
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove())
    .append('text')
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'black')
    .attr('x', 5)
    .text('Stock Price ($)');

  const line = d3
    .line()
    .x(d => x(d.date))
    .y(d => y(d.price));

  const series = g
    .selectAll('.series')
    .data(stocksByCompany)
    .join('g')
    .attr('stroke', d => color(d.symbol)) // this is where line color is set
    .attr('class', 'series')
    .append('path')
    .datum(d => d.prices)
    .attr('fill', 'none')
    .attr('stroke-width', 1.5)
    .attr('d', line);

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Problem 2

Next, we have a heat map that should show the daily precipitation amounts in millimeters for Seattle, WA in 2015.`
)});
  main.variable(observer("minWeatherDate")).define("minWeatherDate", ["d3"], function(d3){return(
d3.timeParse('%Y/%m/%d')("2015/01/01")
)});
  main.variable(observer("maxWeatherDate")).define("maxWeatherDate", ["d3"], function(d3){return(
d3.timeParse('%Y/%m/%d')("2015/12/31")
)});
  main.variable(observer("weather")).define("weather", ["datasets","d3","minWeatherDate","maxWeatherDate"], async function(datasets,d3,minWeatherDate,maxWeatherDate)
{
  return (await datasets['seattle-weather.csv']())
    .map(d => {
      const date = d3.timeParse('%Y/%m/%d')(d.date);
      return {
        'precipitation': d.precipitation,
        'date': date,
        'day': d3.timeFormat('%a')(date),
        'week': +d3.timeFormat('%U')(date)
      }
    })
    .filter(d => d.date >= minWeatherDate && d.date <= maxWeatherDate)
}
);
  main.variable(observer("maxPrecipitation")).define("maxPrecipitation", ["d3","weather"], function(d3,weather){return(
d3.max(weather, d => d.precipitation)
)});
  main.variable(observer()).define(["legend","d3","colorrange","scale"], function(legend,d3,colorrange,scale){return(
legend({
  color: d3
    .scaleLinear()
    .range(colorrange)
    .domain(scale),
  title: "Precipitation"
})
)});
  main.variable(observer()).define(["width","d3","DOM","weather","colorrange","scale"], function(width,d3,DOM,weather,colorrange,scale)
{
  const margin = { top: 20, right: 10, bottom: 10, left: 30 };
  const visWidth = width - margin.left - margin.right;

  const x = d3
    .scaleBand()
    .domain(d3.range(53))
    .range([0, visWidth])
    .padding(0.05);

  const visHeight = x.step() * 7;

  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const y = d3
    .scaleBand()
    .domain(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
    .range([0, visHeight])
    .padding(0.05);

  // day of week labels

  const yAxis = d3
    .axisLeft(y)
    .tickPadding(10)
    .tickSize(0);

  g.append('g')
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove());

  // month labels

  const firstOfMonths = weather.filter(d => d.date.getDate() === 1);

  var myColor = d3
    .scaleLinear()
    .range(colorrange)
    .domain(scale);

  g.selectAll('.month')
    .data(firstOfMonths)
    .join('text')
    .attr('class', 'month')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)
    .attr('x', d => x(d.week))
    .attr('y', -5)
    .text(d => d3.timeFormat('%b')(d.date));

  // squares

  g.selectAll('rect')
    .data(weather)
    .join('rect')
    .attr('x', d => x(d.week))
    .attr('y', d => y(d.day))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style("fill", function(d) {
      return myColor(d.precipitation);
    }); // this is where square color is set

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Problem 3

This dataset contains estimated percent changes in population for each state for 2018 to 2019. We want to show it in a choropleth map. The data is from the [U.S. Census Bureau, Population Division](https://www.census.gov/content/census/en/data/tables/time-series/demo/popest/2010s-state-total.html).

You can find it in the following table linked above: Annual Estimates of the Resident Population for the United States, Regions, States, and Puerto Rico: April 1, 2010 to July 1, 2019 (NST-EST2019-01)`
)});
  main.variable(observer("populations")).define("populations", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment('population-2018-2019.csv').text(), d3.autoType)
    .map(d => ({state: d.state, change: d['percent-change'], population: d.population}))
)});
  main.variable(observer("stateToPopulation")).define("stateToPopulation", ["populations"], function(populations)
{
  const map = new Map(populations.map(d => [
    d.state,
    { change: d.change, population: d.population }
  ]));
  
  return Object.fromEntries(map);
}
);
  main.variable(observer("percentChangeExtent")).define("percentChangeExtent", ["d3","populations"], function(d3,populations){return(
d3.extent(populations, d => d.change)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The map data comes from [here](https://eric.clst.org/tech/usgeojson/) and is based on boundaries given by the U.S. Census Bureau.`
)});
  main.variable(observer("usaGeo")).define("usaGeo", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('gz_2010_us_040_00_20m.json').json()
)});
  main.variable(observer("mapdomain")).define("mapdomain", ["percentChangeExtent"], function(percentChangeExtent){return(
percentChangeExtent[0], 0, percentChangeExtent[1]
)});
  main.variable(observer()).define(["legend","mapcolor"], function(legend,mapcolor){return(
legend({
  color: mapcolor,
  title: "Percent change",
  tickFormat: "+%"
})
)});
  main.variable(observer()).define(["d3","DOM","usaGeo","mapcolor","stateToPopulation"], function(d3,DOM,usaGeo,mapcolor,stateToPopulation)
{
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 400 - margin.top - margin.bottom;

  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // draw map

  const projection = d3.geoAlbersUsa().fitSize([visWidth, visHeight], usaGeo);

  const path = d3.geoPath().projection(projection);

  g.selectAll('.border')
    .data(usaGeo.features.filter(d => d.properties.NAME !== 'Puerto Rico'))
    .join('path')
    .attr('class', 'border')
    .attr('d', path)
    .attr('fill', d => mapcolor(stateToPopulation[d.properties.NAME].change)) // this is where the color of a state is set
    .attr('stroke', 'white');

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Problem 4

Next, we want to have a choropleth map that shows the estimated 2019 population for each state. In this choropleth, we want you to bin the data into 5 bins. Rather than a continuous color range, we only want the map to contain 5 colors.

We can use the same population data as the previous problem.`
)});
  main.variable(observer()).define(["populations"], function(populations){return(
populations
)});
  main.variable(observer()).define(["stateToPopulation"], function(stateToPopulation){return(
stateToPopulation
)});
  main.variable(observer("range")).define("range", ["d3","populations"], function(d3,populations){return(
d3.extent(populations, d => d.population)
)});
  main.variable(observer()).define(["legend","mapcolour","d3"], function(legend,mapcolour,d3){return(
legend({
  color: mapcolour,
  title: "Population",
  tickFormat: "." + d3.precisionRound(0.01, 1.01) + "s"
})
)});
  main.variable(observer()).define(["d3","DOM","usaGeo","mapcolour","stateToPopulation"], function(d3,DOM,usaGeo,mapcolour,stateToPopulation)
{
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 400 - margin.top - margin.bottom;

  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // draw map

  const projection = d3.geoAlbersUsa().fitSize([visWidth, visHeight], usaGeo);

  const path = d3.geoPath().projection(projection);

  g.selectAll('.border')
    .data(usaGeo.features.filter(d => d.properties.NAME !== 'Puerto Rico'))
    .join('path')
    .attr('class', 'border')
    .attr('d', path)
    .attr('fill', d =>
      mapcolour(stateToPopulation[d.properties.NAME].population)
    ) // this is where the color of a state is set
    .attr('stroke', 'white');

  return svg.node();
}
);
  main.variable(observer()).define(["md","lifeExpectancies"], function(md,lifeExpectancies){return(
md`## Problem 5

This dataset contains the life expectancy for ${lifeExpectancies.length} different countries over a few decades. We have a line chart that shows every country, but we want to highlight a few specific countries, listed below.`
)});
  main.variable(observer("highlightCountries")).define("highlightCountries", function(){return(
['Rwanda', 'Kenya', 'China', 'Japan']
)});
  main.variable(observer("countryToLifeExpectancies")).define("countryToLifeExpectancies", ["d3","datasets"], async function(d3,datasets){return(
d3.rollup((await datasets['countries.json']()),
                                g => g.map(d => ({year: d3.timeParse('%Y')(d.year),
                                           life_expect: d.life_expect})),
                                d => d.country)
)});
  main.variable(observer("lifeExpectancies")).define("lifeExpectancies", ["countryToLifeExpectancies"], function(countryToLifeExpectancies){return(
Array.from(countryToLifeExpectancies, ([country, info]) => ({country, info}))
)});
  main.variable(observer("labelPoints")).define("labelPoints", ["highlightCountries","countryToLifeExpectancies"], function(highlightCountries,countryToLifeExpectancies){return(
highlightCountries.map(c => {
  const years = countryToLifeExpectancies.get(c);
  return {
    country: c,
    year: years[years.length - 1].year,
    life_expect: years[years.length - 1].life_expect
  }
})
)});
  main.variable(observer("minYear")).define("minYear", ["d3","lifeExpectancies"], function(d3,lifeExpectancies){return(
d3.min(lifeExpectancies, country => d3.min(country.info, c => c.year))
)});
  main.variable(observer("maxYear")).define("maxYear", ["d3","lifeExpectancies"], function(d3,lifeExpectancies){return(
d3.max(lifeExpectancies, country => d3.max(country.info, c => c.year))
)});
  main.variable(observer("maxLifeExpect")).define("maxLifeExpect", ["d3","lifeExpectancies"], function(d3,lifeExpectancies){return(
d3.max(lifeExpectancies, country => d3.max(country.info, c => c.life_expect))
)});
  main.variable(observer()).define(["legen3"], function(legen3){return(
legen3()
)});
  main.variable(observer()).define(["width","d3","DOM","minYear","maxYear","maxLifeExpect","lifeExpectancies","specialcolor","opacity","labelPoints"], function(width,d3,DOM,minYear,maxYear,maxLifeExpect,lifeExpectancies,specialcolor,opacity,labelPoints)
{
  const margin = { top: 10, right: 100, bottom: 20, left: 40 };
  const visWidth = width - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;

  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = d3
    .scaleTime()
    .domain([minYear, maxYear])
    .range([0, visWidth]);

  const y = d3
    .scaleLinear()
    .domain([0, maxLifeExpect])
    .nice()
    .range([visHeight, 0]);

  const xAxis = d3.axisBottom(x);

  const yAxis = d3.axisLeft(y);

  g.append('g')
    .attr('transform', `translate(0,${visHeight})`)
    .call(xAxis);

  g.append('g')
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove())
    .append('text')
    .attr('text-anchor', 'start')
    .attr('dominant-baseline', 'middle')
    .attr('fill', 'black')
    .attr('x', 5)
    .text('Life Expectancy');

  const line = d3
    .line()
    .x(d => x(d.year))
    .y(d => y(d.life_expect));

  const series = g
    .selectAll('.series')
    .data(lifeExpectancies)
    .join('g')
    .attr('class', 'series')
    .attr('stroke', d => specialcolor(d.country)) // this is where line color is set
    .attr('stroke-opacity', d => opacity(d.country)) // this is where line opacity is set
    .attr('stroke-width', 1)
    .append('path')
    .datum(d => d.info)
    .attr('fill', 'none')
    .attr('d', line);

  g.selectAll('.country-label')
    .data(labelPoints)
    .join('text')
    .attr('class', 'country-label')
    .attr('x', d => x(d.year) + 2)
    .attr('y', d => y(d.life_expect))
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('dominant-baseline', 'middle')
    .text(d => d.country);

  return svg.node();
}
);
  main.variable(observer()).define(["md","origins"], function(md,origins){return(
md`## Problem 6

Finally, we have a scatter plot of cars that compares horsepower and weight. Each car has one of three origins: ${origins.join(', ')}. We want the plot to also show the origin of each car.`
)});
  main.variable(observer("cars")).define("cars", ["datasets"], async function(datasets){return(
(await datasets['cars.json']()).map(d => ({
  horsepower: d['Horsepower'],
  weight: d['Weight_in_lbs'],
  origin: d['Origin']
})).filter(d => d.horsepower !== null && d.weight !== null && d.origin !== null)
)});
  main.variable(observer("origins")).define("origins", ["cars"], function(cars){return(
Array.from(new Set(cars.map(d => d.origin)))
)});
  main.variable(observer()).define(["legen2"], function(legen2){return(
legen2()
)});
  main.variable(observer()).define(["d3","DOM","cars","lightgray","colour"], function(d3,DOM,cars,lightgray,colour)
{
  // margin convention
  const margin = { top: 10, right: 10, bottom: 50, left: 100 };
  const visWidth = 510 - margin.left - margin.right;
  const visHeight = 460 - margin.top - margin.bottom;

  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // create scales

  const x = d3
    .scaleLinear()
    .domain(d3.extent(cars, d => d.horsepower))
    .nice()
    .range([0, visWidth]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(cars, d => d.weight))
    .nice()
    .range([visHeight, 0]);

  // create and add axes

  const xAxis = d3.axisBottom(x);

  g.append("g")
    .attr('transform', `translate(0, ${visHeight})`)
    .call(xAxis)
    .call(g => g.selectAll('.domain').remove())
    .append('text')
    .attr('x', visWidth / 2)
    .attr('y', 40)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .text('horsepower');

  const yAxis = d3.axisLeft(y);

  g.append('g')
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove())
    .append('text')
    .attr('x', -40)
    .attr('y', visHeight / 2)
    .attr('fill', 'black')
    .attr('dominant-baseline', 'middle')
    .text('weight (lbs)');

  // draw grid, based on https://observablehq.com/@d3/scatterplot

  const grid = g.append('g').attr('class', 'grid');

  grid
    .append('g')
    .selectAll('line')
    .data(y.ticks())
    .join('line')
    .attr('stroke', lightgray)
    .attr('x1', 0)
    .attr('x2', visWidth)
    .attr('y1', d => 0.5 + y(d))
    .attr('y2', d => 0.5 + y(d));

  grid
    .append('g')
    .selectAll('line')
    .data(x.ticks())
    .join('line')
    .attr('stroke', lightgray)
    .attr('x1', d => 0.5 + x(d))
    .attr('x2', d => 0.5 + x(d))
    .attr('y1', d => 0)
    .attr('y2', d => visHeight);

  // draw points

  g.selectAll('circle')
    .data(cars)
    .join('circle')
    .attr('cx', d => x(d.horsepower))
    .attr('cy', d => y(d.weight))
    .attr('fill', d => colour(d.origin)) // this is where the dot color is set
    .attr('opacity', 1)
    .attr('r', 3);

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`---
## Appendix`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5', 'd3-array@2')
)});
  main.variable(observer("datasets")).define("datasets", ["require"], function(require){return(
require('vega-datasets')
)});
  main.variable(observer("lightgray")).define("lightgray", function(){return(
'#dcdcdc'
)});
  main.variable(observer("colorrange")).define("colorrange", function(){return(
[
  "#30d074",
  "#2bbb68",
  "#26a65c",
  "#219151",
  "#1c7c45",
  "#18683a",
  "#13532e"
]
)});
  main.variable(observer("scale")).define("scale", function(){return(
[0, 5, 10, 15, 20, 25, 30]
)});
  main.variable(observer("colour")).define("colour", ["d3","origins"], function(d3,origins){return(
d3
  .scaleOrdinal()
  .domain(origins)
  .range(d3.schemeTableau10)
)});
  main.variable(observer("color")).define("color", ["d3","companies"], function(d3,companies){return(
d3
  .scaleOrdinal()
  .domain(companies)
  .range(d3.schemeTableau10)
)});
  main.variable(observer("mapcolor")).define("mapcolor", ["d3"], function(d3){return(
d3
  .scaleLinear()
  .domain([-0.7, 0, 2.1])
  .range(["Pink", "Purple", "Black"])
)});
  main.variable(observer("mapcolour")).define("mapcolour", ["d3","range"], function(d3,range){return(
d3
  .scaleQuantize()
  .domain(range)
  .range(["#F5EEF8", "#D7BDE2", "Purple", "RebeccaPurple", "#4A235A"])
)});
  main.variable(observer("specialcolor")).define("specialcolor", ["d3","highlightCountries"], function(d3,highlightCountries){return(
d3
  .scaleOrdinal()
  .domain(highlightCountries)
  .range(["purple", "#800020", "green", "blue"])
  .unknown("black")
)});
  main.variable(observer("opacity")).define("opacity", ["d3","highlightCountries"], function(d3,highlightCountries){return(
d3
  .scaleOrdinal()
  .domain(highlightCountries)
  .range([1])
  .unknown(.1)
)});
  main.variable(observer("legen2")).define("legen2", ["d3","DOM","width","colour"], function(d3,DOM,width,colour){return(
function legen2() {
  const size = 20;
  const lineHeight = size * 1.5;

  const svg = d3.select(DOM.svg(width, colour.domain().length * lineHeight));

  const rows = svg
    .selectAll("g")
    .data(colour.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);

  rows
    .append("rect")
    .attr("height", size)
    .attr("width", size)
    .attr("fill", d => colour(d));

  rows
    .append("text")
    .attr("font-family", "helvetica")
    .attr("font-size", 12)
    .attr("dominant-baseline", "hanging")
    .attr("x", lineHeight)
    .text(d => d);

  return svg.node();
}
)});
  main.variable(observer("legen")).define("legen", ["d3","DOM","width","color"], function(d3,DOM,width,color){return(
function legen() {
  const size = 10;
  const lineHeight = size * 1.5;

  const svg = d3.select(DOM.svg(width, color.domain().length * lineHeight));

  const rows = svg
    .selectAll("g")
    .data(color.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);

  rows
    .append("rect")
    .attr("height", size)
    .attr("width", size)
    .attr("fill", d => color(d));

  rows
    .append("text")
    .attr("font-family", "helvetica")
    .attr("font-size", 12)
    .attr("dominant-baseline", "hanging")
    .attr("x", lineHeight)
    .text(d => d);

  return svg.node();
}
)});
  main.variable(observer("legen3")).define("legen3", ["d3","DOM","width","specialcolor"], function(d3,DOM,width,specialcolor){return(
function legen3() {
  const size = 10;
  const lineHeight = size * 1.5;

  const svg = d3.select(
    DOM.svg(width, specialcolor.domain().length * lineHeight)
  );

  const rows = svg
    .selectAll("g")
    .data(specialcolor.domain())
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);

  rows
    .append("rect")
    .attr("height", size)
    .attr("width", size)
    .attr("fill", d => specialcolor(d));

  rows
    .append("text")
    .attr("font-family", "helvetica")
    .attr("font-size", 12)
    .attr("dominant-baseline", "hanging")
    .attr("x", lineHeight)
    .text(d => d);

  return svg.node();
}
)});
  return main;
}
