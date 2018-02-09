// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)


    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  .append("g")
    .attr("transform", "translate(" + chartMargin.right + ", " + chartMargin.top + ")");

// Configure a band scale, with a range between 0 and the chartWidth and a padding of 0.1 (10%)
var xBandScale = d3.scaleBand().range([0, chartWidth]).padding(0.1);
// Create a linear scale, with a range between the chartHeight and 0.
var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
// Load data from hours-of-tv-watched.csv
d3.csv("graphdata.csv", function(error, employerData) {
  if (error) throw error;
  console.log(employerData);

  // Set the domain of the band scale to the name of employers
  xBandScale.domain(employerData.map(function(data) {
    return data.EMPLOYER_NAME;
  }));

  // Set the domain of the linear scale to 0 
  yLinearScale.domain([0, d3.max(employerData, function(data) {
    return data.AverageWage;
  })]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
  
  // Create one SVG rectangle per piece of employerdata
  // Use the linear and band scales to position each rectangle within the chart
  svg
    .selectAll(".bar")
      .data(employerData)
      .enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", function(data) {
          return xBandScale(data.EMPLOYER_NAME);
        })
        .attr("y", function(data) {
          return yLinearScale(data.AverageWage);
        })
        .attr("width", xBandScale.bandwidth())
        .attr("height", function(data) {
          return chartHeight - yLinearScale(data.AverageWage);
        });
  // Append two SVG group elements to the SVG area, create the bottom and left axes inside of them
  svg.append("g")
    .call(leftAxis);
  svg.append("g")
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);
});