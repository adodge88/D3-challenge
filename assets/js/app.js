// SET THE SVG CANVAS SIZE
var svgWidth = 960;
var svgHeight = 500;

// SET THE ACTUAL CHART AREA
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// CREATE THE SVG ON THE HTML PAGE
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// IMPORT THE DATA
d3.csv("assets/data/data.csv").then(function(data, err){
    if (err) throw err;
    console.log(data);
    // define a func to transform our data
    data.forEach(function(data){
        // convert to int
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
});
    // create scales
    var xScale = d3.scaleLinear()
        // .domain([0, d3.max(data, d => d.poverty)])
        .domain([d3.min(data, d => d.poverty) * 0.9,
        d3.max(data, d => d.poverty) * 1.1
      ])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)* 1.2])
        .range([height, 0]);

    // create axis
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    //append the axis to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    chartGroup.append("g")
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .classed("stateCircle", true)
        .attr("r", "15");
        // .attr("fill", "blue")
        // .attr("opacity", "0.5");

    // create abbreviation labels
    chartGroup.selectAll("cirlce")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .text(d => d.abbr)
        .classed("stateText", true);

    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

        


  });
  