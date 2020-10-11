const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');

// connecting to DB:
const connectDB = require('./config/db');
connectDB();

// requiring and passing passport:
require('./config/passport')(passport);

// accepting form data:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hbs helpers:
const { formatDate, truncate, stripTags, editIcon, select, ReadMoreBtnVisibility } = require('./helpers/hbs');

// serving static files:
app.use(express.static('/public'));

// setting up view engine:
app.engine('handlebars', exphbs({
    extname: '.handlebars', defaultLayout: 'main', helpers: {
        formatDate,
        truncate,
        editIcon,
        select,
        ReadMoreBtnVisibility
    }
}));
app.set('view engine', 'handlebars');

// implementing express-session:
app.use(session({
    secret: 'helloGuys!',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// passport middleware setup:
app.use(passport.initialize());
app.use(passport.session());

// Method overriding:
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

// setting global variable:
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

// setting routes:
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// port number:
const port = process.env.PORT || 3000;

// setup listener:
app.listen(port, () => {
    console.log(`Server on port ${port}`);
});