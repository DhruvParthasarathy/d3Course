
// Chart dimentsions
const dims = {height: 300, width: 300, radius: 150};

// Chart center
const cent = {x: (dims.width /2 + 5), y: (dims.height / 2 + 5)};

// Creating a svg container
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150)
    .attr('height', dims.height + 150)

// creating a group for the chart elements
const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);

// creating a function which will create the angles for us
const pie = d3.pie()
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
const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius / 2);

// console.log(arcPath(angles[0]));
// M9.184850993605149e-15,-150A150,150,0,0,1,75.00000000000006,129.90381056766577LNaN,NaNZ


// update function
const update = (data) => {
    console.log(data);
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