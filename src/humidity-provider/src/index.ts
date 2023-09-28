import * as express from 'express';

const port = parseInt(process.env.APPLICATION_PORT as string);

const app = express();
app.listen(port, () => {
    console.log(`humidity-provider running on port ${port}`);
});

app.get('/vienna', function (req: express.Request, res: express.Response) {
    res.json({
        humidity: '35%',
    });
});
