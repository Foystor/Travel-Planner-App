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

    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}


/**
 * End Helper Functions
 * Begin Main Functions
 *
*/
// Updates the UI dynamically
const updateUI = async (place, date, diffDays, img, temp, detail) => {
    const template = document.querySelector('template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('img').src = img;
    clone.querySelectorAll('.place').forEach(i => i.textContent = place);
    clone.querySelector('.date').textContent = date;

    if (diffDays < 2) {
        clone.querySelector('.day').textContent = `${diffDays} day`;
    } else {
        clone.querySelector('.day').textContent = `${diffDays} days`;
    }

    clone.querySelector('.temp').textContent = temp;
    clone.querySelector('.detail').textContent = detail;

    // append new item
    document.querySelector('.card-holder').appendChild(clone);
};

// Generate trip
function generateEntry() {
    const place = document.querySelector('#place-input').value;
    const date = document.querySelector('#date-input').value;

    if (!place || !date) {
        alert('Please enter the information');
        return;
    }

    const diffDays = getDaysDiff(date);

    if(diffDays < 0) {
        alert('Date passed!');
    } else {
        // Geonames API
        postData(`${server}/geonames`, {
            base: geoNamesBaseUrl,
            place: place
        })
        .then(res => {
            console.log('GeoNames', res);

            const lat = res.geonames[0].lat;
            const lon = res.geonames[0].lng;

            // Weatherbit API
            postData(`${server}/weatherbit`, {
                base: (diffDays < 7) ? weatherbitCurrentBaseUrl : weatherbitFutureBaseUrl,
                location: `lat=${lat}&lon=${lon}`
            })
            .then(res => {
                console.log('Weatherbit', res);
                const data = res.data[0];

                const temp = (diffDays < 7) ? `${data.temp}°C` : `High ${data.max_temp}, Low ${data.min_temp}`;
                const detail = data.weather.description;

                // Pixabay API
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
        if (data.length !== 0) {
            data.forEach(i => {
                updateUI(i.place, i.date, i.days, i.img, i.temp, i.weather);
            });
            // disable save button
            document.querySelectorAll('.save').forEach(i => i.disabled = true);
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

// Save and Remove button
document.querySelector('.card-holder').addEventListener('click', async (evt) => {

    const target = evt.target;

    if (target.nodeName === 'BUTTON') {
        const item = target.closest('.card-item');

        // check if it's save button
        if (target.classList.contains('save')) {
            target.disabled = true;

            // post data to projectData
            postData(`${server}/addTrip`, {
                place: item.querySelector('.place').textContent,
                date: item.querySelector('.date').textContent,
                days: item.querySelector('.day').textContent,
                img: item.querySelector('img').src,
                temp: item.querySelector('.temp').textContent,
                weather: item.querySelector('.detail').textContent
            })
            .then(data => console.log(data));

        } else {
            // remove button
            const holder = document.querySelector('.card-holder');
            const index = [...holder.children].indexOf(item);
            holder.removeChild(item);

            // remove data from projectData
            const res = await fetch(`${server}/remove?index=${index}`);

            try {
                const data = await res.json();
                console.log(data);
            } catch(error) {
                console.log('error', error);
            }
        }
    }
});



export { generateEntry }