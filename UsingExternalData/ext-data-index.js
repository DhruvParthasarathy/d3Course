// we are going to use the planets.json data to render the elements in the svg div

const svg = d3.select('svg');

// grab the data we want to base the circles on
// d3.json() returns a promise

d3.json('planets.json').then(data => 
    {

        // Once the data is returned from the promise, we create a selection and to the selection we inject the data.

        const circs = svg.selectAll('circles')
        .data(data);

        console.log(circs);

        // Currently there are no circles in the dom 
        // and the elements will be in the enterNodes

        //as a best practice, even if there are no circles, it is best practice to go ahead and add the attributes, because incase there is any circle it will go ahead and render

        // circs.attr('cy', 200)
        // .attr('cx', data => data.distance)
        // .attr('r',data => data.radius)
        // .attr('fill', data => data.fill);

        // for the remaining elements in the enter selection

        circs.enter()
        .append('circle').attr('cy', 200)
        .attr('cx', data => data.distance)
        .attr('r',data => data.radius)
        .attr('fill', data => data.fill);

    })