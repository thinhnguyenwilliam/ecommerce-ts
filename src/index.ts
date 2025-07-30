import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_req, res) => {
    res.send('Hello from Express + TypeScript! hi e iu');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
