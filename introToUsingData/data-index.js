const data = [
    {width: 200, height:100, fill:'purple' },
    {width: 100, height:60, fill:'pink' },
    {width: 50, height:30, fill:'red' }
]

const svg = d3.select('svg');

//1.  In the html we have given only one rect element - hence in the below method only the first data point in the data array will be used 

// Selecing all rect elements and appending data to the selection and returning the selection as a constant called as rect
const rect = svg.selectAll('rect')
.data(data);


// Adding attributes to the selection
// Since the selection has only one rect element currently present it will render one rectangle in the browser
rect.attr("width",(data, index, selection) => { 

    return data.width}
    )
.attr("height", d => d.height)
.attr('fill',(data) => data.fill);

//2.  the remaining data points are available in the 
// rect.enter method. Now below, by accesing that method, we get hold of the remaining data points (enter nodes) and then for each of the data point we decide what to do with it. In the given example, for each data point we append a rectangle and add subsequent properties

// Since each of the enter nodes has the svg element as the parent element, they get appended to the svg element 

rect.enter().append('rect')
.attr("width",(data, index, selection) => { 

    return data.width}
    )
.attr("height", d => d.height)
.attr('fill',(data) => data.fill);

console.log(rect);