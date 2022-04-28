
const xValue = d => d.electricity_generation;
const xLabel_scat = 'electricity_generation';
const yValue = d => d.primary_energy_consumption;
const yLabel_scat = 'primary_energy_consumption';
const margin_scat = { left: 120, right: 30, top: 20, bottom: 120 };

const width_scat = $("#scatterplot").width() / 2;
const height_scat = width_scat;
const svg_scat = d3.select('#scatterplot').append("svg")
    .attr("width", width + margin_scat.left + margin_scat.right)
    .attr("height", height + margin_scat.top + margin_scat.bottom);

const innerWidth = width_scat - margin.left - margin.right;
const innerHeight = height_scat - margin.top - margin.bottom;

const g_scat = svg_scat.append('g')
    .attr('transform', `translate(${margin_scat.left},${margin_scat.top})`);
const xAxisG = g_scat.append('g')
    .attr('transform', `translate(0, ${innerHeight})`);
const yAxisG = g_scat.append('g');

xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth / 2)
    .attr('y', 100)
    .text(xLabel_scat);

yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', -innerHeight / 2)
    .attr('y', -60)
    .attr('transform', `rotate(-90)`)
    .style('text-anchor', 'middle')
    .text(yLabel_scat);

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickPadding(15)
    .tickSize(-innerHeight);

const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(5)
    .tickPadding(15)
    .tickSize(-innerWidth);

const row = d => {
    d.electricity_generation = +d.electricity_generation;
    d.primary_energy_consumption = +d.primary_energy_consumption;

    return d;
};

d3.csv('line.csv', row, data => {
    xScale
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    yScale
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    g_scat.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(xValue(d)))
        .attr('cy', d => yScale(yValue(d)))
        .attr('r', 8);

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
});