
let dims, cent, svg, graph, pie, arcPath, colorScale, paths, legendGroup, legnd;

// Init dimensions
const initDims = () => {
// Chart dimentsions
dims = {height: 300, width: 300, radius: 150};

// Chart center
cent = {x: (dims.width /2 + 5), y: (dims.height / 2 + 5)};
}

// init svg using dimensions
const initSvg   = () => {
    // Creating a svg container
    svg = d3.select('.canvas')
        .append('svg')
        .attr('width', dims.width + 150)
        .attr('height', dims.height + 150)

    // creating a group for the chart elements
    graph = svg.append('g')
        .attr('transform', `translate(${cent.x}, ${cent.y})`);
}

// init scales for the graph
const initScales = () => {
    // creating a function which will create the angles for us
    pie = d3.pie()
        .sort(null) // telling the function to not sort the data based on angle
        .value(d => d.cost); // value looks at each object in the array of data present and based on the cost, the angle is calculated

    // dummy data
    // const angles = pie([
    //     {name: 'rent', cost: 500},
    //     {name: 'bent', cost: 600},
    //     {name: 'gent', cost: 100}

    // ]);

    // console.log(angles);

    // Using arc generator to generate the path for the arcs
    arcPath = d3.arc()
        .outerRadius(dims.radius)
        .innerRadius(dims.radius / 2);

    // console.log(arcPath(angles[0]));
    // M9.184850993605149e-15,-150A150,150,0,0,1,75.00000000000006,129.90381056766577LNaN,NaNZ

    // Creating a color scale
    colorScale = d3.scaleOrdinal(d3['schemeSet3']);    
};

const initLegend = () => {

    //  creating a group for the legend
    legendGroup = svg.append('g');

    legendGroup
        .attr('transform', `translate(${dims.width + 40},10)`);

    // creating the legend
    legend = d3.legendColor()
        .shape('circle') // can use custom path
        .shapePadding(10)
        .scale(colorScale); // this uses the same color scale as used by the donut chart 
}
const init =() => {
    initDims();
    initSvg();
    initScales();
    initLegend();
}

init();

// update function
const update = (data) => {

    // update the domain for the colorscale
    colorScale.domain(data.map(d => d.name));

    //update and call legend

    legendGroup.call(legend); // since the legend is using the color scale and since we are updating the color scale in the lines above, the legend is able to get updated

    legendGroup.selectAll('text').attr('fill', 'white');


    // rejoin enhanced (pie) data to path elements
    paths = graph.selectAll('path')
        .data(pie(data));

    // removing elements from the exit selection
    paths.exit()
    .transition().duration(750)
        .attrTween('d', arcTweenExit)
        .remove();


    // handling currently present elements in the dom
    paths
    .attr('d', arcPath)
    .transition().duration(750)
    .attrTween('d', arcTweenUpdate);

    // Adding new elements
    paths.enter()
        .append('path')
        .attr('class', 'arc')
        // .attr('d', arcPath)
        // .merge(paths)
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('fill', d => colorScale(d.data.name))
        .each(function(d){this._current = d})
        .transition().duration(750)
            .attrTween('d', arcTweenEnter);

}

// Listening to data from db
let data = [];

db.collection('expenses').onSnapshot(res => {

    res.docChanges().forEach(change => {
        const doc = {...change.doc.data() , id : change.doc.id};

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

    });

    update(data);
});

// Arc enter tween
const arcTweenEnter = (d) => {

    //interpolation function
    let i = d3.interpolate(d.endAngle, d.startAngle);
    
    return (t) => {
        d.startAngle = i(t);
        return arcPath(d);
    }
}

// Arc exit tween
const arcTweenExit = (d) => {

    //interpolation function
    let i = d3.interpolate(d.startAngle, d.endAngle);
    
    return (t) => {
        d.startAngle = i(t);
        return arcPath(d);
    }
}

// Arc edit tween
// using function keyword so that we can use the this keyword inside it to reference the current element
function arcTweenUpdate(d) {

    // console.log(this._current, d);

    // interpolate between the 2 objects
    let i = d3.interpolate(this._current, d);

    // Update current prop with new updated data
    this._current = d;
    
    return (t) => {
        return arcPath(i(t));
    }

}