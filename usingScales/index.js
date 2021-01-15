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

    const color = 'pink';

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
    yAxis.ticks(4) // the value d here will be the value which is outputted by the yScale
    .tickFormat( d => d + ' orders');


    
// creating a transition which we will use while updating graphs
const t = d3.transition().duration(1500);

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

    // Sometimes when data for a particular data point on the graph is removed, and the update function on the graph is called, the chart updates, but the dom element for the removed data point still exists on the browser screen.

    // Therefore to remove the dom element from the document the remove method is run on the exit selection nodes
    rects.exit().remove();

    // Step 4 Update current shapes in the dom

    // Update the rectangle in the dom
    // xBandScale.bandwidth will trigger the function xBandScale.bandwidth() which will inturn return the width of each band / bar
    rects
    // .attr('width', xBandScale.bandwidth)
    .attr('fill', color)
    .attr('x', (d,i) => xBandScale(d.name))  // the below steps will be applied by using the merge command on the enter selection
    // .transition(t) // For updating existing dom elements, we just have to transition to the ending position
    //     .attr('y', (d) => yLinearScale(d.orders)) // *Important
    //     .attr('height', d => graphHeight - yLinearScale(d.orders)) // *Important

    // Step 5 Enter selection into dom
    // Append the enter selection elements to the dom
    rects.enter()
    .append('rect')
    // .attr('width', xBandScale.bandwidth) // commenting this out as we will be using a widthTween below the transition attribute
    .attr('y', graphHeight) // we specify the starting conditions of height and y value here
    .attr('height', 0)
    .attr('fill', color)
    .attr('x', (d,i) => xBandScale(d.name))
    .merge(rects) // by using the following command, we ask d3 to do the steps below for the rects selection as well
    .transition(t)  // we specify the transition duration after which we specify the ending conditions for the graph - only the stuff below the merge is applied to both groups
        .attrTween('width', widthTween)
        .attr('y', (d) => yLinearScale(d.orders)) // *Important
        .attr('height', d => graphHeight - yLinearScale(d.orders))  // *Important

    // Calliing axes based on new data

        // The seletion.call method takes the group and runs the axis function onto it - this automatically creates the svgs and adds it into the group
        // Since the xAxisGroup and the yAxis group already have the data about the dimentions and the xAxis and the yAxis objects have information about the scales we are able to see the axis appearing up in the correct locations in the chart
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        // Rotating all the xAxis text elements
        xAxisGroup.selectAll('text')
        .attr('transform', `rotate(-40)`)
        .attr('text-anchor','end') // changing the text anchor from the middle of the text to the end of the text so that rotation happens with reapect to the end
        .attr('fill','brown');
}


// FETCHING DATA AND UPDATING GRAPH ===========================

    // There are various ways of getting data for the graphs, the one commented below is by directly taking from a json file
    // getting data from json file
    // d3.json('menu.json').then(data => {


    // In the line below we connect to the firestore db that we configured in the scale-index.html file and listen to any changes in the data. The onSnapshot method is triggered whenever a change occurs.

    let data = [];

    db.collection('dishes').onSnapshot( res => {

        // the response object cannot be utilized directly, it has another object called as the docChanges. This doc changes array mentions whether a particular entry has been newly added or removed from the database.

        // To get the data from the "docChanges" array we need to cycle through the array to get access to the data
        res.docChanges().forEach(change => {

            // below we create a doc object with the data present in each document along with its document id as present in the db

            const doc = {...change.doc.data(), id: change.doc.id};

            switch(change.type) {
                case 'added' : 
                    // Adding the new data point from the db to the data array for the graph
                    data.push(doc);
                    break;

                case 'modified' :
                    // Finding the index of the doc in the data array and replacing that element with the new data from the database
                    const index = data.findIndex(item => item.id === doc.id);
                    data[index] = doc;
                    break;

                case 'removed' :
                    //removing the doc from the list of items in data array
                    data = data.filter(item => item.id !== doc.id);
                    break;

                default :
                    break;
            }

        })

        update(data);
    })

// Tweens - these are used to defined custom transitions - we are going to create one for the width

const widthTween = (d) => {

    //define the interpolation
    let i = d3.interpolate(0, xBandScale.bandwidth());

    // return a function which takes in the time ticker - d3 will trigger this repeatedly with various values from 0 - 1
    return function(t) {

        // this will return the interpolated value at that time ticker
        return i(t);
    }

    // So when we have attached the widthTween to the selection, the 
    // bar will start at a zero width and will expand to the max width over time, based on the transition time given, the max width is defined by the x.bandWidth() function.
}