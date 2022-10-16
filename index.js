const express = require('express');
const dotenv = require('dotenv');

// import router
const userRouter = require('./routes/user_route')

// init express
const app = express();

dotenv.config();

app.use(express.json());

app.use('/api/v1/', userRouter);

app.get('/', (request, response) => {
  response.json({ info: 'This is home api' })
})

app.all('*', (req, res, next) => {
	res.sendStatus(500);
});

const port = Number(process.env.APP_PORT || 8000);
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})