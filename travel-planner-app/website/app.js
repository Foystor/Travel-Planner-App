/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
// Personal API Key for OpenWeatherMap API
const apiKey = '&appid=028f1a9d317578516fd3770eef8e37e7&units=imperial';


/* Events */
function generateEntry() {
    const zipCode = document.querySelector('#zip').value;
    const feel = document.querySelector('#feelings').value;
    // create a new date instance dynamically
    const d = new Date();
    const newDate = `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear()}`;

    getWeather(baseUrl, zipCode, apiKey)
    .then(data => {
        postData('/addWeather', {
            temp: data.main.temp,
            date: newDate,
            feel: feel
        });
    })
    .then(() => updateUI());
}

document.querySelector('#generate').addEventListener('click', generateEntry);


/* Requests */
// GET request to the OpenWeatherMap API
const getWeather = async (url, code, key) => {
    const res = await fetch(url + code + key);

    try {
        const data = await res.json();
        console.log('Data from OpenWeatherMap', data);
        return data;
    } catch(error) {
        console.log('error', error);
    }
};

// POST request to add the API data, as well as data entered by the user, to Project Data
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
        console.log('projectData after POST', newData);
        return newData;
    } catch(error) {
        console.log('error', error);
    }
};

// GET Project Data and updates the UI dynamically
const updateUI = async () => {
    const res = await fetch('/all');

    try {
        const data = await res.json();
        console.log('Data for UI update', data);
        // update UI
        document.querySelector('#date').innerHTML = `Date: ${data.date}`;
        document.querySelector('#temp').innerHTML = `Temperature: ${Math.round(data.temp)} °F`;
        document.querySelector('#content').innerHTML = `Feelings: ${data.feel}`;
    } catch(error) {
        console.log('error', error);
    }
};