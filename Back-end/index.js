const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
// set up port
const PORT = process.env.PORT || 3000;
const course = require('./routes/course.js');
const category = require('./routes/category.js');
const users = require('./routes/users.js');

app.use(bodyParser.json());
app.use(cors());
// add routes



app.use('/api/course', course);
app.use('/api/category', category);
app.use('/api/user', users);

// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



