const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT;



app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./config/mongoose.config')

app.use('/api/users', require('./routes/user.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/coaches', require('./routes/coach.routes'));
app.use('/api/cv', require('./routes/cv.routes'));
app.use('/api/admin', require('./routes/admin.routes'));




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));