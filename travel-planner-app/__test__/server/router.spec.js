describe('The router', () => {
    const axios = require('axios');
    const url = 'http://127.0.0.1:8000';

    let server;

    beforeEach(() => {
        server = require('../../src/server/server');
    });
    afterEach(async () => {
        await server.close();
    });

    test('/addTrip', async () => {
        const res = await axios.post(`${url}/addTrip`, {
            place: 'Paris',
            date: '2023-6-7',
            days: '1 day',
            img: '',
            temp: '30°C',
            weather: 'Cloudy'
        });

        expect(res.status).toBe(200);
        expect(res.data[0].temp).toEqual('30°C');
        expect(res.data[0].weather).toEqual('Cloudy');
    });
})