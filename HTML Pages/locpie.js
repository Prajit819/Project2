// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 1000;

// Define the chart's margins as an object
var chartMargin = {
  top: 300,
  right: 300,
  bottom: 300,
  left: 300
};


// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
  .select("body")
  .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth )
  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  .append("g")
    .attr("transform", "translate(" + chartMargin.right + ", " + chartMargin.top + ")");

    d3.csv("worksitedata.csv", function(error, locationData) {
   
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
        console.log(pie(locationData));
        // transform the tvData with the pie function, append one path for each element in tvData
        // Use the arc function to draw the pie chart's paths
        svg
          .selectAll("path")
            .data(pie(locationData))
            .enter()
            .append("path")
              .attr("d", arc)
              .attr("fill", function(pieData) {
                console.log(pieData);
                console.log(pieData.data);
                console.log(pieData.data.EmployeeCount);
                return color(pieData.data.EmployeeCount);
              });
              
      var legendG = svg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
      .data(pie(locationData))
      .enter().append("g")
      .attr("transform", function(d,i){
        return "translate(" + (chartWidth - 110) + "," + (i * 15 + 20) + ")"; // place each legend on the right and bump each one down 15 pixels
      })
      .attr("class", "legend");   
    
    legendG.append("rect") // make a matching color rect
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", function(d, i) {
        return color(i);
      });
    
    legendG.append("text") // add the text
      .text(function(d){
        return d.value + "  " + d.data.WORKSITE;
      })
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 11);
      });