// An overview of creating a bar graph using d3

// 1. Selecting the div element and appending a svg into it
// 3. Create a group inside the svg element for the graph area
//      Inside this graph area is where we append 2 groups - one for each axis and the bars for each data point

// SETTING UP SVG ELEMENTS - chart area - xaxis group and yaxis group 

    // select the container first
    const svg = d3.select('.canvas')
    .append('svg')
    .attr('width',600)
    .attr('height',600);

    // Create margins and dimensions - this margin will be set within the limits of the svg- we can think of it as a padding given to the svg
    const margin = {top: 20, right: 20, bottom: 100, left: 100}

    // defining the dimentions of the graph - dimentions of the svg - margin properties
    const graphWidth = 600 - margin.left - margin.right;
    const graphHeight = 600 - margin.top - margin.bottom;

    // creating a group element inside the svg container within which we will create the graph
    const graph = svg.append('g').attr('width',graphWidth )
    .attr('height',graphHeight );

    // Now even though we have given the height and width of the graph - the group (graph) element will still be starting from the very edges-
    // hence we have to translate it a little bit to the right and a little to the bottom
    graph.attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Defining the axes for the graph
    const xAxisGroup = graph.append('g') // The x Axis by default appears on the top of the graph - so we have to manually translate it to the bottom
    .attr('transform', `translate(0, ${graphHeight})`);

    const yAxisGroup = graph.append('g');

// SETTING UP SCALES ============================================

    // Scaling height of the bars in the chart -----------------
    //creating a linear scale for scaling the y values of the bar chart
    const yLinearScale = d3.scaleLinear();
    // Range is the values that needs to come out on the dom
    // These are aligned with the height and width available to display in the dom
    yLinearScale.range([graphHeight,0]); 

    // In normal cases we will give the range as from 0 to the larger value, but in svgs the y axis is measured from the top, hence to compensate for that, we give the start value as the graph height and tell it to end at 0.

    // Scaling the x-Axis - BAND scale --------------

    // We are going to pass in an array of names - the chart will give a bar for each name

    // The chart will also give out the x position and the width of each bar in the chart

    const xBandScale = d3.scaleBand().range([0,500]) 
    // range gets the dimensions of the graph along x
    // The range has to do with the width available to plot the graph

    // Setting a padding between the induvidual bars and the padding to the left and right of the chart
    xBandScale.paddingInner(0.2).paddingOuter(0.2);


// CREATING AXES ===================================================

    // We are going to now use the axes generators provided by d3 to use the available data and the various scales defined to create the axes

    // the d3.axisBottom takes in the xScale that we have defined to get automaticaly linked with the range along x
    const xAxis = d3.axisBottom(xBandScale);
    const yAxis = d3.axisLeft(yLinearScale);


    // Formatting the axes
    yAxis.ticks(3) // the value d here will be the value which is outputted by the yScale
    .tickFormat( d => d + ' orders');

    // Rotating all the xAxis text elements
    xAxisGroup.selectAll('text')
    .attr('transform', `rotate(-40)`)
    .attr('text-anchor','end') // changing the text anchor from the middle of the text to the end of the text so that rotation happens with reapect to the end
    .attr('fill','orange');


// UPDATE FUNCTION

const update = (data) => {

    // Step 1 Updating scale domains ========================

    // Setting the min and max limit of the input values
    // const min = d3.min(data, d => d.orders);
    const max = d3.max(data, d => d.orders);

    // We can use the above method OR the below one to find the limits

    // Finding the extent - returns the array of minimum and maximum
    // The extent can be used to set in the domain for the yLinearScale.
    // const extent = d3.extent(data, d => d.orders);
   

    // Domain is the range of input values
    yLinearScale.domain([0,max]);

    xBandScale.domain(data.map(x => x.name)) // array of names of each item

    // Step 2 Join updated data to elements ========================

    // Selecting the rectangles in the graph(g/group) element and joining the data
    const rects = graph.selectAll('rect').data(data);

    // Step 3 Remove any unwanted shapes using exit selection =============
    rects.exit().remove();

    // Step 4 Update current shapes in the dom

    // Update the rectangle in the dom
    // xBandScale.bandwidth will trigger the function xBandScale.bandwidth() which will inturn return the width of each band / bar
    rects.attr('width', xBandScale.bandwidth)
    .attr('height', d => graphHeight - yLinearScale(d.orders)) // *Important
    .attr('fill', 'orange')
    .attr('x', (d,i) => xBandScale(d.name))
    .attr('y', (d) => yLinearScale(d.orders)); // *Important

    // Step 5 Enter selection into dom
    // Append the enter selection elements to the dom
    rects.enter()
    .append('rect')
    .attr('width', xBandScale.bandwidth)
    .attr('height', d => graphHeight - yLinearScale(d.orders))  // *Important
    .attr('fill', 'orange')
    .attr('x', (d,i) => xBandScale(d.name))
    .attr('y', (d) => yLinearScale(d.orders)); // *Important

    // Calliing axes based on new data

        // The seletion.call method takes the group and runs the axis function onto it - this automatically creates the svgs and adds it into the group
        // Since the xAxisGroup and the yAxis group already have the data about the dimentions and the xAxis and the yAxis objects have information about the scales we are able to see the axis appearing up in the correct locations in the chart
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

}


// FETCHING DATA AND UPDATING GRAPH ===========================

    // There are various ways of getting data for the graphs, the one commented below is by directly taking from a json file
    // getting data from json file
    // d3.json('menu.json').then(data => {


    // In the line below we connect to the firestore db that we configured in the scale-index.html file and get the data present in the collection called dishes

    db.collection('dishes').get().then(response => {

        // console.log(response);

        let data = [];

        // The response is not directly in an usable format - 
        // response['docs'] key has the data which we need and we use the 
        // .data() method on it to extract the data and we push each of the key value pair into the data array which we need for the graph

        response['docs'].forEach(element => {
            // console.log(element.data());
            data.push(element.data());
        });

        // console.log(data);

        update(data);
        
    })