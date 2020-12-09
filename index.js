const canvas = d3.select(".canvas");

const svg = canvas.append('svg');

svg.attr("height", 600)
.attr("width",600)

// creating a group element

const group = svg.append('g').attr('transform','translate(100, 300)');

// append shapes to the group element inside the container
group.append('rect')
.attr("width",200).attr("height", 100).attr('fill', "blue");

group.append('circle')
.attr('cx', 200).attr('cy', 100)
.attr('r', 50).attr('fill', 'green').attr('stroke', "orange").attr('stroke-width',4)

// Append a text element to svg
svg.append('text').attr('x', 20)
.attr('y',200).attr('fill', 'grey').text("hi there. Testing svg elements").style("font-family", 'sans-serif')

// group element - helps grouping elements inside the svg conainer

