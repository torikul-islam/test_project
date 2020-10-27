const express = require('express');
const morgan = require('morgan');
const app = express();
const config = require('config');
require('./db');
const fileUpload = require('express-fileupload');
const music = require('./routes/music');
const users = require('./routes/user');
const auth = require('./routes/auth');



app.use(express.static('uploads'));
app.use(fileUpload({ createParentPath: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use('/api/music', music);
app.use('/api/users', users);
app.use('/api/auth', auth);


// configuration 

// console.log(`Application name: ${config.get('name')}`)
// console.log(`pass: "  ${config.get('password')}`)



const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`${config.get('name')} server listening on port: ${port}`);
});
