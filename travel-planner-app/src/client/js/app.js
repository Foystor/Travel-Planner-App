/**
 * Define Global Variables
 *
*/
const geoNamesBaseUrl = 'http://api.geonames.org/searchJSON?name_equals=';
const weatherbitCurrentBaseUrl = 'http://api.weatherbit.io/v2.0/current?';
const weatherbitFutureBaseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayBaseUrl = 'https://pixabay.com/api/?q=';
const server = 'http://localhost:8000';


/**
 * End Global Variables
 * Start Helper Functions
 *
*/
// POST request to server
const postData = async (url = '', data = {}) => {
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await res.json();
        return newData;
    } catch(error) {
        console.log('error', error);
    }
};

// See how soon the trip is
function getDaysDiff(date) {
    const now = new Date();
    date = new Date(date);

    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}


/**
 * End Helper Functions
 * Begin Main Functions
 *
*/
// GET Project Data and updates the UI dynamically
const updateUI = async (place, date, diffDays, img, temp, detail) => {
    document.querySelector('img').src = img;
    document.querySelectorAll('.place').forEach(i => i.textContent = place);
    document.querySelector('#date').textContent = date;

    if (diffDays < 2) {
        document.querySelector('#day').textContent = `${diffDays} day`;
    } else {
        document.querySelector('#day').textContent = `${diffDays} days`;
    }

    document.querySelector('#temp').textContent = temp;
    document.querySelector('#detail').textContent = detail;
    document.querySelector('.card-holder').style.display = 'grid';
};

// Generate trip
function generateEntry() {
    const place = document.querySelector('#place-input').value;
    const date = document.querySelector('#date-input').value;

    if (!place || !date) {
        alert('Please enter information');
        return;
    }

    const diffDays = getDaysDiff(date);

    if(diffDays < 0) {
        alert('Date passed!');
    } else {
        postData(`${server}/geonames`, {
            base: geoNamesBaseUrl,
            place: place
        })
        .then(res => {
            console.log('GeoNames', res);

            const lat = res.geonames[0].lat;
            const lon = res.geonames[0].lng;

            postData(`${server}/weatherbit`, {
                base: (diffDays < 7) ? weatherbitCurrentBaseUrl : weatherbitFutureBaseUrl,
                location: `lat=${lat}&lon=${lon}`
            })
            .then(res => {
                console.log('Weatherbit', res);
                const data = res.data[0];

                const temp = (diffDays < 7) ? `${data.temp}°C` : `High ${data.max_temp}, Low ${data.min_temp}`;
                const detail = data.weather.description;

                postData(`${server}/pixabay`, {
                    base: pixabayBaseUrl,
                    place: place
                })
                .then(res => {
                    console.log('Pixabay', res);
                    const img = res.hits[0].webformatURL;

                    updateUI(place, date, diffDays, img, temp, detail);
                });
            })
        })
    }
}


/**
 * End Main Functions
 * Begin Events
 *
*/
document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch(`${server}/all`);

    try {
        const data = await res.json();
        console.log(data);

        // if projectData is not empty, update UI
        if (Object.keys(data).length !== 0) {
            updateUI(data.place, data.date, data.days, data.img, data.temp, data.weather);
            // disable save button
            document.querySelector('#save').disabled = true;
        }
    } catch(error) {
        console.log('error', error);
    }
});

// Add trip button
document.querySelector('.page-header button').addEventListener('click', () => {
    document.querySelector('.form').style.display = 'flex';
});

// Generate button
document.querySelector('#generate').addEventListener('click', () => generateEntry());

// Cancel button
document.querySelector('#cancel').addEventListener('click', () => {
    document.querySelector('.form').style.display = 'none';
    document.querySelector('#place-input').value = '';
    document.querySelector('#date-input').value = '';
});

// Save button
document.querySelector('#save').addEventListener('click', () => {
    document.querySelector('#save').disabled = true;

    // post data to projectData
    postData(`${server}/addTrip`, {
        place: document.querySelector('.place').textContent,
        date: document.querySelector('#date').textContent,
        days: document.querySelector('#day').textContent,
        img: document.querySelector('img').src,
        temp: document.querySelector('#temp').textContent,
        weather: document.querySelector('#detail').textContent
    })
    .then(data => console.log(data));
});

// Remove button
document.querySelector('#remove').addEventListener('click', async () => {
    document.querySelector('.card-holder').style.display = 'none';
    document.querySelector('#save').disabled = false;

    // remove data from projectData
    const res = await fetch(`${server}/remove`);

    try {
        const data = await res.json();
        console.log(data);
    } catch(error) {
        console.log('error', error);
    }
});



export { generateEntry }