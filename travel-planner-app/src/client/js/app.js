/* Global Variables */
const geoNamesBaseUrl = 'http://api.geonames.org/searchJSON?name_equals=';
const weatherbitCurrentBaseUrl = 'http://api.weatherbit.io/v2.0/current?';
const weatherbitFutureBaseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const pixabayBaseUrl = 'https://pixabay.com/api/?q=';
const server = 'http://localhost:8000';


/* Events */
function generateEntry() {
    const place = document.querySelector('#place-input').value;
    const date = document.querySelector('#date-input').value;

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

                    postData(`${server}/addTrip`, {
                        place: place,
                        date: date,
                        days: diffDays,
                        img: img,
                        temp: temp,
                        weather: detail
                    })
                    .then(() => updateUI());
                });
            })
        })
    }
}

document.querySelector('#generate').addEventListener('click', generateEntry);


/* Requests */
// GET request to the OpenWeatherMap API
const getWeather = async (url, code, key) => {
    const res = await fetch(url + code + key);

    try {
        const data = await res.json();
        return data;
    } catch(error) {
        console.log('error', error);
    }
};

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

// GET Project Data and updates the UI dynamically
const updateUI = async () => {
    const res = await fetch(`${server}/all`);

    try {
        const data = await res.json();
        console.log('UI update', data);
        // update UI
        document.querySelector('img').src = data.img;
        document.querySelectorAll('.place').forEach(i => i.textContent = data.place);
        document.querySelector('#date').textContent = data.date;

        if (data.days < 2) {
            document.querySelector('#day').textContent = `${data.days} day`;
        } else {
            document.querySelector('#day').textContent = `${data.days} days`;
        }

        document.querySelector('#temp').textContent = data.temp;
        document.querySelector('#detail').textContent = data.weather;
    } catch(error) {
        console.log('error', error);
    }
};

function getDaysDiff(date) {
    const now = new Date();
    date = new Date(date);

    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export { generateEntry }