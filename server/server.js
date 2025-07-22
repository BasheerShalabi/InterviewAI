const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello from server!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));