const form = document.querySelector('form');

const inputName = document.querySelector('#name');
const cost = document.querySelector('#cost');

const error = document.querySelector('#error');

form.addEventListener('submit',(e) => {

    // Immediate action of a submit button is a reload action
    // we stop the refresh from happening

    e.preventDefault();

    if(inputName.value && cost.value) {

        const item = {name: inputName.value, cost: parseInt(cost.value)};

        db.collection('expenses').add(item).then(res => {
            inputName.value = '';
            cost.value = '';
            error.textContent = '';
        });

    } else {
        error.textContent = 'Please enter values before submitting';
    }
})