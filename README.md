# Travel Planner App

Real-world project from [Front End Web Developer](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011) at Udacity.

A dynamic travel weather planning application that helps people plan trips by generating weather forecasts for the places they’re visiting.

It obtains the desired trip location and the date you are leaving, and displays the weather and an image of the location using information obtained from external APIs.

If the trip is within a week, you will get the current weather forecast. If the trip is in the future, you will get a predicted forecast.

## Demo

https://github.com/Foystor/Travel-Planner-App/assets/74621252/f9b7146d-fed5-4025-84be-a6ad23b248fc

## Goals

This project aims to give us the opportunity to put all of the skills we’ve developed throughout the [Front End Web Developer](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd0011) Nanodegree program into one project to build our own custom travel app.

It is very `JavaScript` heavy, but it is still expected us create clean and appealing `HTML/CSS`. We will also be targeting the `DOM`, working with objects, and retrieving data from 3 APIs in which one of those is reliant on another to work.

Finally, this is all going to be done in a `Webpack` environment, using an `express server`, and wrapped up with `service workers`.

## Technologies

- Node.js
- Express
- Asynchronous Javascript
- Sass
- Webpack
- Jest
- Service Worker
- ESLint

## APIs

The **OpenWeather API** is fantastic but it doesn’t let us get future data for free and it’s not that flexible with what information we enter.

So we are going to use:

- [Weatherbit API](https://www.weatherbit.io/account/create): it only takes in coordinates for weather data.
- [Geonames API](http://www.geonames.org/export/web-services.html): to get those coordinates.
- [Pixabay API](https://pixabay.com/api/docs/): displays an image of the location entered.

## Usage

Make sure [Node.js](https://nodejs.org/en/download) is installed and in your `PATH`.

1. In the `root` directory:

```
$ git clone https://github.com/Foystor/Travel-Planner-App.git
```

2. Get to the `travel-planner-app` directory:

```
$ cd travel-planner-app
```

3. Create a new `.env` file and fill it with your API key:
```
GEONAMES_KEY = '&maxRows=10&username=********'
WEATHERBIT_KEY = '&key=**************************'
PIXABAY_KEY = '&key=**************************'
```

4. Install packages:
```
$ npm install
```

5. Build the project:
```
$ npm run build
```

6. Start the server:
```
$ npm run start
```

7. Navigate to http://localhost:8000/

## License

[MIT License](LICENSE)
