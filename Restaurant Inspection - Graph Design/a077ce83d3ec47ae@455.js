export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Graph Design - Exercise

In this exercise, we will be working data derived from the [NYC Restaurant Inspection Results dataset](https://data.cityofnewyork.us/Health/DOHMH-New-York-City-Restaurant-Inspection-Results/43nn-pn8j).

For each problem below, create a visualization using D3 that provides an answer to the questions. Also write a short justification of your visualization design choices.

To get started, create a fork of this notebook. When you are finished, **do not** publish your notebook. Instead, go to the menu at the top with the three dots and click "Enable link sharing." You can then submit the link on NYU Classes.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Data

First, we'll import D3.`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@2")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Next, we'll load the inspection results data.`
)});
  main.variable(observer("inspectionsURL")).define("inspectionsURL", function(){return(
'https://gist.githubusercontent.com/DanielKerrigan/886a83eb76068a1caf46ef630a276099/raw/267f9c1a45c1ee8e60cdd40f84f77697b38dfb02/nyc_restaurant_inspections_2019.csv'
)});
  main.variable(observer("data")).define("data", ["d3","inspectionsURL"], function(d3,inspectionsURL){return(
d3.csv(inspectionsURL, row => {
  const date = d3.timeParse("%Y-%m-%d")(row["INSPECTION DATE"]);
  
  const d = {
    restaurantID: row["CAMIS"],
    boro: row["BORO"],
    zip: row["ZIPCODE"],
    cuisine: row["CUISINE DESCRIPTION"],
    date: date,
    violationCode: row["VIOLATION CODE"],
    score: +row["SCORE"],
    grade: row["GRADE"],
    inspectionID: row["INSPECTION ID"]
  };
  
  return d;
})
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
Each object in this dataset represents a violation citation that was issued during a restaurant inspection. If one inspection found multiple violations, then there is one row per violation. In this case, each row has the same values except for the violaiton code. If two violations have the same inspection ID, then they are from the same inspection. If an inspection found no violations, then there is one object with no violation code.

Lastly, we'll load a map from violation code to violation description. You don't have to use this, but you may find it interesting.`
)});
  main.variable(observer("violationCodeURL")).define("violationCodeURL", function(){return(
"https://gist.githubusercontent.com/DanielKerrigan/35566990420138bb843b780be049b71c/raw/4cb07f7e6b2f6898f8e00863a98dd36881b4b853/nyc_restaurant_inspections_violation_codes.csv"
)});
  main.variable(observer("violationCodeToDescription")).define("violationCodeToDescription", ["d3","violationCodeURL"], async function(d3,violationCodeURL){return(
new Map(await d3.csv(violationCodeURL, row => [row["CODE"], row["DESCRIPTION"]]))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Problem 1

What is the distribution of grades over cuisine descriptions? Which cuisise descriptions have the best/worst distribution?

Use only the top 5 most frequent cuisine descriptions in the dataset. You may also want to consider only showing certain grades, such as A, B, C, or A, B, C, Other.

Make sure you only count one grade per inspection. If one inspection has multiple violations, then each violation object will have the same grade. You only want to count the grade once.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`
American cuisise descriptions have the best/worst distribution`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Used only the top 5 most frequent cuisine descriptions in the dataset such as the A, B, C, Other`
)});
  main.variable(observer("TopGrade")).define("TopGrade", ["data","d3"], function(data,d3)
{
  const violationsForGrades = data.filter(
    d => (d.grade == "A") | (d.grade == "B") | (d.grade == "C")
  );
  const violationsByCuisine = d3.rollup(
    violationsForGrades,
    violations => violations.length,
    d => d.cuisine
  );
  const violationsByCuisineArray = Array.from(
    violationsByCuisine,
    ([Cuisine, Violations]) => ({ Cuisine, Violations })
  );
  const violationsSorted = violationsByCuisineArray
    .sort((a, b) => d3.descending(a.Violations, b.Violations))
    .slice(0, 5);
  const topFive = violationsSorted.map(d => d.Cuisine);
  const topCuisines = violationsForGrades.filter(d =>
    topFive.includes(d.cuisine)
  );

  const cuisineVsGrade = d3.rollup(
    topCuisines,
    group => new Set(group.map(g => g.inspectionID)).size,
    d => d.cuisine,
    d => d.grade
  );

  return Array.from(cuisineVsGrade, ([cuisine, map]) => {
    map.set('A', map.get('A'));
    map.set('B', map.get('B'));
    map.set('C', map.get('C'));
    map.set('cuisine', cuisine);
    return Object.fromEntries(map);
  });
}
);
  main.variable(observer("grades")).define("grades", function(){return(
["A", "B", "C"]
)});
  main.variable(observer("Area")).define("Area", ["d3","data"], function(d3,data){return(
Array.from(
    d3.rollup(data, inspections => d3.sum(inspections, c => 1), d => d.boro),
    ([key, value]) => ({ key, value })
  )
    .sort((a, b) => d3.descending(a.value, b.value))
    .map(d => d.key)
)});
  main.variable(observer("AreaTop")).define("AreaTop", ["Area"], function(Area){return(
Area.slice(0, 5)
)});
  main.variable(observer("color")).define("color", ["d3","AreaTop"], function(d3,AreaTop){return(
d3
  .scaleOrdinal()
  .domain(AreaTop)
  .range(d3.schemeCategory10)
)});
  main.variable(observer("legend")).define("legend", ["d3","DOM","width","color"], function(d3,DOM,width,color){return(
function legend() {
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
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "hanging")
    .attr("x", lineHeight)
    .text(d => d);

  return svg.node();
}
)});
  main.variable(observer()).define(["legend"], function(legend){return(
legend()
)});
  main.variable(observer()).define(["width","d3","DOM","TopGrade","grades","color"], function(width,d3,DOM,TopGrade,grades,color)
{
  const margin = { top: 10, right: 0, bottom: 20, left: 120 };
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

  const y = d3
    .scaleLinear()
    .domain([0, 6000])
    .nice()
    .range([visHeight, 0]);

  const grouper = d3
    .scaleBand()
    .domain(TopGrade.map(d => d.cuisine))
    .range([0, visWidth])
    .padding(0.25);

  const x = d3
    .scaleBand()
    .domain(grades)
    .range([0, grouper.bandwidth()])
    .padding(0.5);

  const xAxis = d3.axisBottom(grouper);

  const yAxis = d3.axisLeft(y);

  g.append('g')
    .attr('transform', `translate(0,${visHeight})`)
    .call(xAxis)
    .call(g => g.selectAll('.domain').remove());

  g.append("g")
    .call(yAxis)
    .call(g => g.selectAll('.domain').remove())
    .append('text')
    .attr('fill', 'black')
    .attr('x', -40)
    .attr('y', visHeight / 2)
    .text('Violations');

  const series = g
    .selectAll('.group')
    .data(TopGrade)
    .join('g')
    .attr('class', 'group')
    .attr('transform', d => `translate(${grouper(d.cuisine)},0)`)
    .selectAll('rect')
    .data(d => Object.entries(d).filter(([key, value]) => grades.includes(key)))
    .join('rect')
    .attr('fill', d => color(d[0]))
    .attr('y', d => y(d[1]))
    .attr('height', d => visHeight - y(d[1]))
    .attr('x', d => x(d[0]))
    .attr('width', x.bandwidth());

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Problem 2

How do the number of inspections change over time for each borough?

Use month as the level of temporal granularity.`
)});
  main.variable(observer("Inspection")).define("Inspection", ["data","d3"], function(data,d3)
{
  let inspectionWithBorough = data.filter(d => d.boro !== "" && d.boro !== "0" &&  d.date !== "");
  
  const violations = {};
  inspectionWithBorough.forEach( d => violations[d.restaurantID + ' => ' + d.date] = d); 
  
  const counts =  d3.nest()
    .key(d => d.boro)
    .key(d => d.date.getMonth() + 1)
    .rollup(v => v.length)
    .object(Object.keys(violations).map(k => violations[k]))
  
  return Object.keys(counts).map(k => ({
    boro: k,
    values: Object.keys(counts[k]).map(month => ({date: month, value: counts[k][month]}) ),
  }));
}
);
  main.variable(observer("legend2")).define("legend2", ["width","color2"], function(width,color2){return(
svg => {
  const g = svg
      .attr("transform", `translate(${width},0)`)
      .attr("text-anchor", "end")
      .attr("font-family", "Helvetica Neue")
      .attr("font-size", 15)
    .selectAll("g")
    .data(color2.domain().slice().sort())
    .join("g")
      .attr("transform", (d, i) => `translate(0,${i * 15})`);

  g.append("rect")
      .attr("x", -19)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", color2);

  g.append("text")
      .attr("x", -24)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .text(d => d);
}
)});
  main.variable(observer("height2")).define("height2", function(){return(
300
)});
  main.variable(observer("width2")).define("width2", function(){return(
600
)});
  main.variable(observer("margin2")).define("margin2", function(){return(
{top: 20, bottom: 30 ,right: 20, left: 30}
)});
  main.variable(observer("y2")).define("y2", ["d3","Inspection","height2","margin2"], function(d3,Inspection,height2,margin2){return(
d3.scaleLinear()
    .domain([0, d3.max(Inspection
                       , d => d3.max(d.values, d => d.value) )])
    .nice()
    .range([height2 - margin2.bottom, margin2.top])
)});
  main.variable(observer("x2")).define("x2", ["d3","margin2","width"], function(d3,margin2,width){return(
d3.scaleLinear()
    .domain([1, 12])
    .range([margin2.left, width - margin2.right])
)});
  main.variable(observer("yAxis2")).define("yAxis2", ["margin2","d3","y2"], function(margin2,d3,y2){return(
g => g
    .attr("transform", `translate(${margin2.left},0)`)
    .call(d3.axisLeft(y2))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold"))
)});
  main.variable(observer("xAxis2")).define("xAxis2", ["height2","margin2","d3","x2"], function(height2,margin2,d3,x2){return(
g => g
    .attr("transform", `translate(0,${height2 - margin2.bottom})`)
    .call(d3.axisBottom(x2).ticks(13).tickSizeOuter(0))
)});
  main.variable(observer("line")).define("line", ["d3","x2","y2"], function(d3,x2,y2){return(
d3.line()
    .x(d => x2(d.date))
    .y(d => y2(d.value))
)});
  main.variable(observer("color2")).define("color2", ["d3","Inspection"], function(d3,Inspection){return(
d3.scaleOrdinal(d3.schemeTableau10).domain(Inspection.map(d => d.boro))
)});
  main.variable(observer()).define(["Inspection"], function(Inspection){return(
Inspection.map(d => d.boro)
)});
  main.variable(observer("graph2")).define("graph2", ["d3","width","height2","xAxis2","yAxis2","Inspection","color2","line","legend2"], function(d3,width,height2,xAxis2,yAxis2,Inspection,color2,line,legend2)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height2])
    .style("overflow", "visible");

  svg.append("g").call(xAxis2);

  svg.append("g").call(yAxis2);

  const path = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(Inspection)
    .join("path")
    .style("mix-blend-mode", "multiply")
    .attr("stroke", d => color2(d.boro))
    .attr("d", d => line(d.values));

  svg.append("g").call(legend2);

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`## Problem 3

Is there a relationship between cuisine type and violation? Do some cuisine types have uique violations that differ from the others?

Again, use only the top 5 most frequent cuisine descriptions in the dataset. You can filter the violations as you see fit.`
)});
  main.variable(observer("Relationship")).define("Relationship", ["data","d3"], function(data,d3)
{
  const inspection = data.filter(d => d.violationCode !== "");
  const freqDescriptions = d3.rollup(
    inspection,
    main => main.length,
    d => d.cuisine
  );
  const freq = Array.from(freqDescriptions, ([cuisine, count]) => ({
    cuisine,
    count
  }));
  return freq
    .sort((a, b) => d3.descending(a.count, b.count))
    .slice(0, 5)
    .map(d => d.cuisine);
}
);
  main.variable(observer("violations_top")).define("violations_top", ["data","d3"], function(data,d3)
{
  const havingGrades = data.filter(d => d.violationCode !== "");
  const byGrades = Array.from(
    d3.rollup(havingGrades, v => v.length, d => d.violationCode),
    ([violation, count]) => ({ violation, count })
  );
  return byGrades
    .sort((a, b) => d3.descending(a.count, b.count))
    .slice(0, 10)
    .map(d => d.violation);
}
);
  main.variable(observer("violation_key")).define("violation_key", ["data","Relationship","violations_top","d3"], function(data,Relationship,violations_top,d3)
{
  const inspFiltered = data.filter(
    d =>
      (d.cuisine == Relationship[0] ||
        d.cuisine == Relationship[1] ||
        d.cuisine == Relationship[2] ||
        d.cuisine == Relationship[3] ||
        d.cuisine == Relationship[4]) &&
      (d.violationCode == violations_top[0] ||
        d.violationCode == violations_top[1] ||
        d.violationCode == violations_top[2] ||
        d.violationCode == violations_top[3] ||
        d.violationCode == violations_top[4] ||
        d.violationCode == violations_top[5] ||
        d.violationCode == violations_top[6] ||
        d.violationCode == violations_top[7] ||
        d.violationCode == violations_top[8] ||
        d.violationCode == violations_top[9])
  );

  const cuisineCount = d3.rollup(
    inspFiltered,
    function(group) {
      const inspectionIDs = group.map(g => g.inspectionID);
      const uniqueInspectionIDs = new Set(inspectionIDs);
      return uniqueInspectionIDs.size;
    },
    d => d.violationCode,
    d => d.cuisine
  );

  return Array.from(cuisineCount, ([violationCode, cuisineToCount]) => ({
    violationCode: violationCode,
    cuisines: Array.from(cuisineToCount, ([cuisine, count]) => ({
      cuisine,
      count
    }))
  }));
}
);
  main.variable(observer()).define(["d3","DOM","Relationship","violations_top","violation_key"], function(d3,DOM,Relationship,violations_top,violation_key)
{
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  const visWidth = 700 - margin.left - margin.right;
  const visHeight = 600 - margin.top - margin.bottom;
  const svg = d3.select(
    DOM.svg(
      visWidth + margin.left + margin.right,
      visHeight + margin.top + margin.bottom
    )
  );
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "helvetica")
    .attr("font-size", "22px");

  const x = d3
    .scalePoint()
    .domain(Relationship)
    .range([0, visWidth])
    .padding(0.5);

  const y = d3
    .scalePoint()
    .domain(violations_top)
    .range([0, visHeight])
    .padding(0.5);

  const maxRadius = 12;
  const radius = d3
    .scaleSqrt()
    .domain([0, 2300])
    .range([0, maxRadius]);

  const legend = g
    .append("g")
    .attr("transform", `translate(${visWidth + margin.right - 50}, 0)`)
    .selectAll("g")
    .data([100, 500, 1000, 1500])
    .join("g")
    .attr("transform", (d, i) => `translate(0, ${i * 6 * maxRadius})`);

  legend
    .append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "Purple");

  legend
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius)
    .text(d => d);

  const xAxis = d3.axisBottom(x);

  g.append("g")
    .attr("transform", `translate(0, ${visHeight})`)
    .call(xAxis)
    .call(g => g.selectAll(".domain").remove())
    .append("text")
    .attr("x", visWidth / 2)
    .attr("y", 50)
    .attr("fill", "Purple")
    .attr("text-anchor", "middle");

  const yAxis = d3.axisLeft(y);

  g.append("g")
    .call(yAxis)
    .call(g => g.selectAll(".domain").remove())
    .append("text")
    .attr("x", -65)
    .attr("y", visHeight / 3)
    .attr("fill", "black")
    .attr("dominant-baseline", "middle");

  const rows = g
    .selectAll(".row")
    .data(violation_key)
    .join("g")
    .attr("transform", d => `translate(0, ${y(d.violationCode)})`);

  rows
    .selectAll("circle")
    .data(d => d.cuisines)
    .join("circle")
    .attr("cx", d => x(d.cuisine))
    .attr("cy", d => 0)
    .attr("fill", "Purple")
    .attr("r", d => radius(d.count));

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`
REFERENCES : 
Observablehq Notebooks`
)});
  return main;
}
