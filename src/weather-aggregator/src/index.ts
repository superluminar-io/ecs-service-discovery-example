import * as express from 'express';
import axios from 'axios';

const port = parseInt(process.env.APPLICATION_PORT as string);
const humidityProviderUrl = process.env.HUMIDITY_PROVIDER_URL as string;
const temperatureProviderUrl = process.env.TEMPERATURE_PROVIDER_URL as string;

const app = express();
app.listen(port, () => {
    console.log(`weather-aggregator running on port ${port}`);
});

app.get('/weather/vienna', async (req: express.Request, res: express.Response) => {
    try {
        const responses = await Promise.all([
            axios.get(`${humidityProviderUrl}/vienna`),
            axios.get(`${temperatureProviderUrl}/vienna`),
        ]);

        res.json({
            location: 'vienna',
            ...responses[0].data,
            ...responses[1].data,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: 'Ups, something went wrong :(',
        });
    }
});

app.get('/', function (req: express.Request, res: express.Response) {
    res.send('Hello from weather-aggregator!');
});
