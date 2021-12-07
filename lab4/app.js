const config = require('./config');
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const universitiesRouter = require('./routes/universities');
const specialtiesRouter = require('./routes/specialties');
const aboutRouter = require('./routes/about');

const apiUsersRouter = require('./routes/apiUsers');
const apiUniversitiesRouter = require('./routes/apiUniversities');

const PORT = config.port;
const mongodbUri = config.mongodbUri;

const app = express();
const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',

	helpers: {
		if_eq: function (a, b, opts) {
			if (a === b) return opts.fn(this);
			else return opts.inverse(this);
		},
	},
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(
	fileUpload({
		createParentPath: true,
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/universities', universitiesRouter);
app.use('/specialties', specialtiesRouter);
app.use('/about', aboutRouter);

app.use('/api/users', apiUsersRouter);
app.use('/api/universities', apiUniversitiesRouter);

async function start() {
	try {
		await mongoose.connect(mongodbUri, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});

		app.listen(PORT, () => {
			console.log(`Server has been started on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.log('ERROR:', err);
	}
}

start();
