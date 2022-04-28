
// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 0, left: 10 },
    width_stream = $("#stream2").width() - margin.left - margin.right,
    height_stream = $("#stream2").width() - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_s2 = d3.select("#stream2")
    .append("svg")
    .attr("width", width_stream + margin.left + margin.right)
    .attr("height", height_stream + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("Book1.csv", function (data) {

    // List of groups = header of the csv files
    var keys = data.columns.slice(1)

    // Add X axis
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, width_stream]);
    svg_s2.append("g")
        .attr("transform", "translate(0," + height_stream * 0.8 + ")")
        .call(d3.axisBottom(x).tickSize(-height_stream * .7))
        .select(".domain").remove()
    // Customization
    svg_s2.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg_s2.append("text")
        .attr("text-anchor", "end")
        .attr("x", width_stream)
        .attr("y", height_stream - 30)
        .text("Time (year)");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-70000, 45000])
        .range([height_stream, 0]);

    // color palette
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemeDark2);

    //stack the data?
    var stackedData2 = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (data)

    // create a tooltip
    var Tooltip = svg_s2
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", 0)
        .style("font-size", 17)

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".myArea").style("opacity", .2)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d, i) {
        grp = keys[i]
        Tooltip.text(grp)
    }
    var mouseleave = function (d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    }

    // Area generator
    var area = d3.area()
        .x(function (d) { return x(d.data.year); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })

    // Show the areas
    svg_s2
        .selectAll("mylayers")
        .data(stackedData2)
        .enter()
        .append("path")
        .attr("class", "myArea")
        .style("fill", function (d) { return color(d.key); })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

})