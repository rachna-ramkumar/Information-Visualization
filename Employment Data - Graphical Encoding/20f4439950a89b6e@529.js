import define1 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["gz_2010_us_040_00_20m.json",new URL("./files/5bffca711a2b45090494c77bab30bfa36859ecb5a0619c7d93e1da8f8089be61df96021c578b53cfbd2c3f6611e2567183fec5ed9a66876b50bb47123b2c56b9",import.meta.url)],["unemployment-dec-2019@2.csv",new URL("./files/6ff47364694fc89e81852ef1f47e221ae3b0dc3b06edf3248613be7840459f835ce51379b282d7a1e5460d03f88565e5883f64691061d81835a633a0edbd4a07",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Graphical Encoding - Exercise

In this exercise, we have a dataset that contains the unemployment rate for each state for December 2019. Your task is to visualize this data in 5 different ways. This exercise is about exploring possibilities, so it's okay if some of your visualizations aren't the most effective.

To get started, create a fork of this notebook. When you are finished, **do not** publish your notebook. Instead, go to the menu at the top with the three dots and click "Enable link sharing." You can then submit the link on NYU Classes.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data

The map data comes from [here](https://eric.clst.org/tech/usgeojson/) and is based on boundaries given by the U.S. Census Bureau.`
)});
  main.variable(observer("usaGeo")).define("usaGeo", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('gz_2010_us_040_00_20m.json').json()
)});
  main.variable(observer()).define(["md"], function(md){return(
md`The unemployment data comes from the [U.S. Bureau of Labor Statistics](https://www.bls.gov/web/laus/laumstrk.htm). We'll put the unemployment data in two formats:
- An array of objects where each object has the name and unemployment rate of the state.
- A single object where the keys are the state names and the values are the unemployment rates.`
)});
  main.variable(observer("unemployment")).define("unemployment", ["d3","FileAttachment"], async function(d3,FileAttachment){return(
d3.csvParse(await FileAttachment('unemployment-dec-2019@2.csv').text(),
                           d3.autoType)
)});
  main.variable(observer("stateToRate")).define("stateToRate", ["unemployment"], function(unemployment){return(
Object.fromEntries(new Map(unemployment.map(d => [d.state, d.rate])))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We'll calculate the min and max unemployment rates:`
)});
  main.variable(observer("extent")).define("extent", ["d3","unemployment"], function(d3,unemployment){return(
d3.extent(unemployment, d => d.rate)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Next, we'll create a color scale. Feel free to modify this or use other color scales too.`
)});
  main.variable(observer("color")).define("color", ["d3","extent"], function(d3,extent){return(
d3.scaleSequential()
      .domain(extent)
      .interpolator(d3.interpolateBlues)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Lastly, you may find it handy to have a mapping from state name to abbreviation. This data is from [World Population Review](https://worldpopulationreview.com/states/state-abbreviations/).`
)});
  main.variable(observer("stateToAbbr")).define("stateToAbbr", function(){return(
{
  "Alabama": "AL",
  "Alaska": "AK",
  "American Samoa": "AS",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "District of Columbia": "DC",
  "Federated States Of Micronesia": "FM",
  "Florida": "FL",
  "Georgia": "GA",
  "Guam": "GU",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Marshall Islands": "MH",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Northern Mariana Islands": "MP",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Palau": "PW",
  "Pennsylvania": "PA",
  "Puerto Rico": "PR",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virgin Islands": "VI",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Example 1: Choropleth Map`
)});
  main.variable(observer()).define(["legend","color"], function(legend,color){return(
legend({
  color: color,
  title: 'Unemployment Rate, Decemeber 2019'
})
)});
  main.variable(observer()).define(["d3","DOM","usaGeo","color","stateToRate"], function(d3,DOM,usaGeo,color,stateToRate)
{
  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const visWidth = 600 - margin.left - margin.right;
  const visHeight = 400 - margin.top - margin.bottom;

  const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
                                visHeight + margin.top + margin.bottom));

  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // draw map
  
  const projection =  d3.geoAlbersUsa()
      .fitSize([visWidth, visHeight], usaGeo);

  const path = d3.geoPath().projection(projection);

  g.selectAll('.border')
    // we're not going to show Puerto Rico and it's not in the
    // unemployment rate data, so we'll filter it out
    .data(usaGeo.features.filter(d => d.properties.NAME !== 'Puerto Rico'))
    .join('path')
      .attr('class', 'border')
      .attr('d', path)
      .attr('fill', d => color(stateToRate[d.properties.NAME]))
      .attr('stroke', 'white')

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Example 2: Speedometer Charts

This visualization encodes the unemployment rate using the angle of a line.

We'll augment the data to make it easier to place into a grid.`
)});
  main.variable(observer("numCols")).define("numCols", function(){return(
8
)});
  main.variable(observer("numRows")).define("numRows", function(){return(
7
)});
  main.variable(observer("gridPositions")).define("gridPositions", ["d3","numRows","numCols"], function(d3,numRows,numCols){return(
d3.cross(d3.range(numRows),
                         d3.range(numCols),
                         (row, col) => ({row, col}))
)});
  main.variable(observer("unemploymentWithGrid")).define("unemploymentWithGrid", ["d3","unemployment","gridPositions"], function(d3,unemployment,gridPositions){return(
d3.zip(unemployment, gridPositions)
    .map(([data, pos]) => ({...data, ...pos}))
)});
  main.variable(observer()).define(["d3","DOM","numCols","numRows","extent","unemploymentWithGrid","lightgray"], function(d3,DOM,numCols,numRows,extent,unemploymentWithGrid,lightgray)
{
  const margin = {top: 30, right: 20, bottom: 0, left: 30};
  const visWidth = 750 - margin.left - margin.right;
  const visHeight = 450 - margin.top - margin.bottom;

  const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
                                visHeight + margin.top + margin.bottom));

  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // title
  g.append('text')
      .attr('class', 'title')
      .attr('x', visWidth / 2)
      .attr('y', -margin.top)
      .text('Unemployment Rate, Dec. 2019');

  // set up scales
  
  const column = d3.scaleBand()
      .domain(d3.range(numCols))
      .range([0, visWidth])
      .paddingInner(0.05);
  
  const row = d3.scaleBand()
      .domain(d3.range(numRows))
      .range([0, visHeight])
      .paddingInner(0.05);
  
  const angle = d3.scaleLinear()
      .domain([0, Math.ceil(extent[1])])
      .range([0, Math.PI]);
  
  const radius = Math.min(column.bandwidth(), row.bandwidth()) / 2;
  
  // create a group for each cell in the grid
  const cell = g.selectAll('g')
    .data(unemploymentWithGrid)
    .join('g')
      .attr('transform', d => `translate(${column(d.col) + radius},${row(d.row) + radius})`);
  
  // use an arc generator to create a half-circle
  
  const arc = d3.arc()
      .innerRadius(radius - 1)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);
  
  cell.append('path')
      .attr('d', arc())
      .attr('fill', lightgray);
  
  // add baseline
  const line = d3.line();
  
  cell.append('path')
      .attr('d', d => line([[-radius, 0], [radius, 0]]))
      .attr('fill', 'none')
      .attr('stroke', lightgray)
      .attr('stroke-width', 1)
  
  // add sloped line
  cell.append('path')
      .attr('d', d => {
        const start = [0, 0];
        const end = [-Math.cos(angle(d.rate)) * radius,
                     -Math.sin(angle(d.rate)) * radius];
        return line([start, end])
      })
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 2);
  
  // add labels
  
  cell.append('text')
      .attr('y', 20)
      .attr('class', 'state-label')
      .text(d => d.state);
  
  cell.append('text')
      .attr('class', 'arc-label')
      .attr('x', -radius)
      .attr('y', 10)
      .text('0');
  
  cell.append('text')
      .attr('class', 'arc-label')
      .attr('x', radius)
      .attr('y', 10)
      .text(Math.ceil(extent[1]));

  return svg.node();
}
);
  main.variable(observer("mean")).define("mean", ["d3","unemployment"], function(d3,unemployment){return(
d3.median(unemployment.map( d => d.rate))
)});
  main.variable(observer("colorState")).define("colorState", ["d3"], function(d3){return(
d3.scaleOrdinal(d3.schemeSet1 )
)});
  main.variable(observer("stateToGeometry")).define("stateToGeometry", ["usaGeo"], function(usaGeo){return(
usaGeo.features.reduce((result, d) => {
  result[d.properties.NAME] = d;
  return result;
}, {})
)});
  main.variable(observer("colour")).define("colour", ["d3"], function(d3){return(
d3.scaleSequential(d3.interpolatePurples)
            .domain([2.4, 6.1])
)});
  main.variable(observer("colors")).define("colors", ["d3","extent"], function(d3,extent){return(
d3.scaleSequential()
      .domain(extent)
      .interpolator(d3.interpolatePurples)
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Solution 1:`
)});
  main.variable(observer()).define(["legend","colorState"], function(legend,colorState){return(
legend({
  color: colorState,
  title: 'Cities with Unemployement greater than mean'
})
)});
  main.variable(observer()).define(["d3","DOM","usaGeo","colorState","stateToRate","mean"], function(d3,DOM,usaGeo,colorState,stateToRate,mean)
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

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "helvetica")
    .attr("font-size", "20px")
    .text("Rate of Unemployement in the USA");

  const path = d3.geoPath().projection(projection);

  g.selectAll('.border')
    .data(usaGeo.features)
    .join('path')
    .attr('class', 'border')
    .attr('d', path)
    .attr('fill', d => colorState(stateToRate[d.properties.NAME] > mean))
    .attr('stroke', 'silver');

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Solution 2:`
)});
  main.variable(observer()).define(["d3","DOM","usaGeo","extent","unemployment","stateToGeometry"], function(d3,DOM,usaGeo,extent,unemployment,stateToGeometry)
{
  const margin = { top: 40, right: 0, bottom: 10, left: 40 };
  const visWidth = 800 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;

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

  const maxRadius = 10;
  const radius = d3
    .scaleSqrt()
    .domain(extent)
    .range([3, maxRadius]);

  const legend = g
    .append("g")
    .selectAll("g")
    .data([2.9, 3.9, 5.2, 6.1])
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * 3.0 * maxRadius})`);

  legend
    .append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "silver");

  legend
    .append("text")
    .attr("font-family", "helvetica")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => d);

  const path = d3.geoPath().projection(projection);
  g.selectAll('.border')
    .data(usaGeo.features)
    .join('path')
    .attr('class', 'border')
    .attr('d', path)
    .attr('stroke', 'black')
    .attr("fill", "rebeccapurple");

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "helvetica")
    .attr("font-size", "20px")
    .text("Rate of Unemployment in the USA");

  g.selectAll(".dot")
    .data(unemployment)
    .join("circle")
    .attr("class", "dot")
    .attr("fill", "silver")
    .attr("cx", d => {
      const [x, y] = path.centroid(stateToGeometry[d.state]);
      return x;
    })
    .attr("cy", d => {
      const [x, y] = path.centroid(stateToGeometry[d.state]);
      return y;
    })
    .attr("r", d => radius(d.rate));

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Solution 3:`
)});
  main.variable(observer()).define(["width","d3","DOM","unemployment","unemploymentWithGrid"], function(width,d3,DOM,unemployment,unemploymentWithGrid)
{
  const margin = {top: 40, right: 20, bottom: 40, left: 180};
  const visWidth = width - margin.left - margin.right;
  const visHeight = 900 - margin.top - margin.bottom;
  const svg = d3.select(DOM.svg(visWidth + margin.left + margin.right,
                                visHeight + margin.top + margin.bottom));
  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

 
  
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top+10)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "helvetica")
    .attr("font-size", "20px")
    .text("Rate of unemployment in the USA");
  
  
  const x = d3.scaleLinear()
      .domain([0, d3.max(unemployment, d => d.rate)]).nice()
      .range([0, visWidth]);
  
  const y = d3.scaleBand()
      .domain(unemploymentWithGrid.map(d => d.state))
      .range([0, visHeight])
      .padding(0.2);
  
  
  
  const xAxis = d3.axisBottom(x);
  const xAxis1 = d3.axisTop(x);
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis)
      .call(g => g.selectAll(".domain").remove())
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 35)
      .attr("fill", "silver")
      .attr('stroke', 'rebeccapurple')
      .attr("text-anchor", "middle")
      .text("Rate of Unemployment");
  
  const yAxis = d3.axisLeft(y);
  
  g.append("g")
      .call(yAxis)
      .call(g => g.selectAll(".domain").remove()); 
  
  g.selectAll("rect")
    .data(unemploymentWithGrid)
    .join("rect")
      .attr("x", d => 0)
      .attr("y", d => y(d.state))
      .attr("width", d => x(d.rate))
      .attr("height", d => y.bandwidth())
      .attr("fill", "rebeccapurple");
  
  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Solution 4:`
)});
  main.variable(observer()).define(["legend","colour"], function(legend,colour){return(
legend({
  color: colour,
  title: 'Unemployement rate of cities greater than 3.5'
})
)});
  main.variable(observer()).define(["d3","unemployment","mean"], function(d3,unemployment,mean)
{
 
		const margin = {top: 40, right: 50, bottom: 60, left: 50};
    
    const width = 1000 - margin.left - margin.right,
    		height = 700 - margin.top - margin.bottom;
    
    const svg = d3.create("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
    const cfg = {
      labelMargin: 5,
      xAxisMargin: 10,
      legendRightMargin: 10
    }
    
    const x = d3.scaleLinear()
    	.range([0, width]);
    
    const colour = d3.scaleSequential(d3.interpolatePurples);
    
    const y = d3.scaleBand()
    	.range([height, 0])
    	.padding(0.1);

    
    const legend = svg.append("g")
    	.attr("class", "legend");
    
    legend.append("text")
      .attr("x", width)
    	.attr("y", height)
    	.attr("text-anchor", "end")
    	.style("opacity", 0.5)
    	.text("Unemployment rate");
    
  
    
      y.domain(unemployment.map(function(d) { return d.state; }));
      x.domain(d3.extent(unemployment, function(d) { return d.rate; }));
      
      const max = d3.max(unemployment, function(d) { return d.rate; })
      const min = d3.min(unemployment, function(d) { return d.rate; })
      colour.domain([2.4, 6.1]);
      
      const yAxis = svg.append("g")
      	.attr("class", "y-axis")
      	.attr("transform", "translate(" + x(0) + ",0)")
      	.append("line")
          .attr("y1", 0)
          .attr("y2", height);
      
      const xAxis = svg.append("g")
      	.attr("class", "x-axis")
      	.attr("transform", "translate(0," + (height + cfg.xAxisMargin) + ")")
      	.call(d3.axisBottom(x).tickSizeOuter(0));
      
      const bars = svg.append("g")
      	.attr("class", "bars")
      
      bars.selectAll("rect")
      	.data(unemployment)
      .enter().append("rect")
      	.attr("class", "annual-growth")
      	.attr("x", function(d) {
       		return x(Math.min(mean, d.rate));
      	})
      	.attr("y", function(d) { return y(d.state); })
      	.attr("height", y.bandwidth())
      	.attr("width", function(d) { 
        	return Math.abs(x(d.rate) - x(mean))
      	})
      	.style("fill", function(d) {
        	return colour(d.rate)
      	});
      
      var labels = svg.append("g")
      	.attr("class", "labels");
      
      labels.selectAll("text")
      	.data(unemployment)
      .enter().append("text")
      	.attr("class", "bar-label")
      	.attr("x", x(mean))
      	.attr("y", function(d) { return y(d.state)})
      	.attr("dx", function(d) {
        	return d.rate < mean ? cfg.labelMargin : -cfg.labelMargin;
      	})
      	.attr("dy", y.bandwidth())
      	.attr("text-anchor", function(d) {
        	return d.rate < mean ? "start" : "end";
      	})
      	.text(function(d) { return d.state })
    
  return svg.node().parentNode;
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Solution 5:`
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",d")
)});
  main.variable(observer("funcao1")).define("funcao1", function(){return(
function (input, to){
    
    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['District Of Columbia', 'DC'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(let i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }    
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(let i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }    
    }
}
)});
  main.variable(observer("visual3")).define("visual3", ["unemployment","funcao1"], function(unemployment,funcao1){return(
unemployment.map(d => { 
  return {state: funcao1(d.state, "abbr"), rate:d.rate}
})
)});
  main.variable(observer("pack")).define("pack", ["d3"], function(d3){return(
visual3 => d3.pack()
    .size([1000 - 2, 1000 - 2])
    .padding(3)
  (d3.hierarchy({children: visual3})
    .sum(d => d.rate))
)});
  main.variable(observer()).define(["legend","colors"], function(legend,colors){return(
legend({
  color: colors,
  title: 'Rate of Unemployement in the USA'
})
)});
  main.variable(observer()).define(["pack","visual3","d3","DOM","colors","format"], function(pack,visual3,d3,DOM,colors,format)
{
  const root = pack(visual3);

  const svg = d3
    .create("svg")
    .attr("viewBox", [1, 1, 1000, 1000])
    .attr("font-size", 20)
    .attr("font-family", "helvetica")
    .attr("text-anchor", "middle");

  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  leaf
    .append("circle")
    .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
    .attr("r", d => d.r)
    .attr("fill-opacity", 1.0)
    .attr("fill", d => colors(d.data.rate));

  leaf
    .append("clipPath")
    .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
    .attr("xlink:href", d => d.leafUid.href);

  leaf
    .append("text")
    .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.state)
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 1}em`)
    .text(d => d);

  leaf.append("title").text(
    d =>
      `${
        d.data.states === undefined
          ? ""
          : `${d.data.state}
`
      }${format(d.data.rate)}`
  );

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`---
## Appendix`
)});
  main.variable(observer()).define(["html","lightgray"], function(html,lightgray){return(
html`<style>
.title {
  text-anchor: middle;
  dominant-baseline: hanging;
  font-family: sans-serif;
  font-size: 16px;
}

.state-label {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 10px;
}

.arc-label {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 12px;
  fill: ${lightgray}
}
</style>`
)});
  main.variable(observer("lightgray")).define("lightgray", function(){return(
'#dcdcdc'
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5', 'd3-array@2')
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  return main;
}
