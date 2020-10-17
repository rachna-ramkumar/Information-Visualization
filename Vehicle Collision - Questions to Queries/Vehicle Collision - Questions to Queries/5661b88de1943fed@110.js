export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# From Questions to Queries - Exercise`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`For this practice, we'll be using NYC vehicle collision data from [NYC Open Data](https://data.cityofnewyork.us/Public-Safety/Motor-Vehicle-Collisions-Crashes/h9gi-nx95). I've uploaded a modified subset of this data for 2019 as a [Gist](https://gist.github.com/DanielKerrigan/d01fc44e4cee0c5c2434f464497ba260). Each row is a crash and contains the date, time, borough, zip code, number of people injured, number of people killed, and the main factor. Some rows have missing values.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`We can use use [\`d3.csv\`](https://github.com/d3/d3-fetch#csv) to load the dataset. We will pass it a function that gets called for every row and converts the fields to the right type. For example, we turn the date and time strings into one [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object.`
)});
  main.variable(observer("url")).define("url", function(){return(
'https://gist.githubusercontent.com/DanielKerrigan/d01fc44e4cee0c5c2434f464497ba260/raw/982bcefac49be9fd29887cbaead524e033f6dad4/nyc-collisions-2019-reduced.csv'
)});
  main.variable(observer("data")).define("data", ["d3","url","Datetype","Daytype"], function(d3,url,Datetype,Daytype){return(
d3.csv(url, crash => ({
    // combine the date and time strings into one Date object
    dateTime: d3.timeParse('%m/%d/%Y')(crash.date),
    month: Datetype(d3.timeParse('%m/%d/%Y')(crash.date)),
    day: Daytype(d3.timeParse('%m/%d/%Y')(crash.date)),
    borough: crash.borough,
    zip: crash.zip,
    injured: +crash.injured, // + converts the string to an int
    killed: +crash.killed,
    cause: crash.cause
}))
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Q1: How did the situation change over time?

Translate the high-level question into a more concrete task:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`*<b>TASK 1 : Identify the number of collisions that took place every month, respectively.<br /><b>TASK 2: Deduce a visible pattern, if one exists.*`
)});
  main.variable(observer("Datetype")).define("Datetype", ["d3"], function(d3){return(
d3.timeFormat("%b")
)});
  main.variable(observer("Daytype")).define("Daytype", ["d3"], function(d3){return(
d3.timeFormat("%A")
)});
  main.variable(observer()).define(["d3","data"], function(d3,data)
{const numCollisionsByMonth = d3.rollup(data,crashesFormonth => crashesFormonth.length,d => d.month);
 const monthCollisionCounts = Array.from(numCollisionsByMonth,([month, numCollisions]) => ({month, numCollisions}));
 return monthCollisionCounts.sort((a, b) => d3.descending(a.monthCollisions, b.monthCollisions)).slice(0, 12);
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`*<b>SOLUTION : <br/>1. The number of collisions that took place in 2019 alone has been grouped based on months they occurred and have been displayed above. <br/> 2. Even though there is no definite correlation, if we look closely, there is a sudden increase in May and June, and they decrease throughout the year slowly.*`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Q2: What are the main causes behind the collisions? How can we improve the situation?

Translate the high-level question into a more concrete task:`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`*<b>TASK 1 : Identify the causes of collisions and group them, respectively and pinpoint the three major causes of collisions.<br />TASK 2: Based on the conclusion, make suggestions on how to ameliorate the circumstances.*`
)});
  main.variable(observer()).define(["data","d3"], function(data,d3)
{// filter out collisions that do not have data
const collisions_cause = data.filter(d => d.cause !== "Unspecified");
const collision_causes = collisions_cause.filter(d => d.cause !== "");
//number of collisions
const num_collisions = d3.rollup(collision_causes,numcause => numcause.length,d => d.cause);
 // turn the map into an array of objects that have two keys: cause and numCollisions
const CollisionCounts = Array.from(num_collisions,([cause, CollisionCounts]) => ({cause, CollisionCounts}));
return CollisionCounts.sort((a, b) => d3.descending(a.CollisionCounts, b.CollisionCounts)).slice(0, 3); 

}
);
  main.variable(observer()).define(["md"], function(md){return(
md`*<b>SOLUTION : <br/>1.The number of collisions caused in 2019 is grouped based on the causes respectively, and we can arrive on the fact that the three primary reasons were, Driver, being distracted, tailing without sufficient gap and not yielding the right of way in that particular order. <br/> 2. From the above conclusions, it is evident that the driver not being attentive has caused the majority number of collisions in 2019, directly or indirectly. I believe the use of electronic devices during driving must be one of the reasons for this, and impose strict penalties on drivers who use electronic devices while driving. Timely alerts in every road regarding the turns up ahead can also help the drivers get prepared and help them yield the appropriate Right-of-Way.*`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`---
## Appendix`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5", "d3-array@2")
)});
  return main;
}
