
// set the dimensions and margins of the graph
var width_pie = $("#piechart").width();
height_pie = $("#piechart").width() / 2;
margin_pie = 20;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width_pie, height_pie) / 2 - margin_pie

// append the svg object to the div called 'my_dataviz'
var svg_pie = d3.select("#piechart")
    .append("svg")
    .attr("width", width_pie)
    .attr("height", height_pie)
    .append("g")
    .attr("transform", "translate(" + width_pie / 2 + "," + height_pie / 2 + ")");

// Create dummy data
var data = { Brazil: 1.24, Canada: 7.94, China: 14.98, India: 2.92, Mexico: 0.87, UK: 5.37, US: 66.68 }


// set the color scale
var color = d3.scaleOrdinal()
    .domain(["2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"])
    .range(d3.schemeDark2);

// Compute the position of each group on the pie:
var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(function (d) { return d.value; })
var data_ready = pie(d3.entries(data))

// The arc generator
var arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg_pie
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', function (d) { return (color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Add the polylines between chart and labels:
svg_pie
    .selectAll('allPolylines')
    .data(data_ready)
    .enter()
    .append('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d) {
        var posA = arc.centroid(d) // line insertion in the slice
        var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg_pie
    .selectAll('allLabels')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function (d) { console.log(d.data.key); return d.data.key })
    .attr('transform', function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })