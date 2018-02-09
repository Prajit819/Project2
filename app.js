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

    d3.csv("graphdata.csv", function(error, employerData) {
   
        // Create an ordinal scale using a built in D3 color palette as the range
        var cat20 = d3.schemeCategory20;
        var color = d3.scaleOrdinal(cat20);
        // Set the pie chart's radius to be half of the chart height or half or the chart width, whichever is smaller
        var radius = Math.min(chartWidth, chartHeight)/ 2;
        // Configure an arc function that will be used to draw the paths making up the pie chart
        var arc = d3.arc().innerRadius(0).outerRadius(radius);
        // Configure a pie function will be used to size slices in the pie chart according to number of hours watched
        var pie = d3.pie().value(function(data) {
          console.log(data.EmployeeCount)
          return data.EmployeeCount;
        });
        // Print the the transformed tvData returned by the pie function
        console.log(pie(employerData));
        // transform the tvData with the pie function, append one path for each element in tvData
        // Use the arc function to draw the pie chart's paths
        svg
          .selectAll("path")
            .data(pie(employerData))
            .enter()
            .append("path")
              .attr("d", arc)
              .attr("fill", function(pieData) {
                console.log(pieData);
                console.log(pieData.data);
                console.log(pieData.data.EmployeeCount);
                return color(pieData.data.EmployeeCount);
              });
      });