const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const exphbs = require('express-handlebars');

const routes = {};
routes['index'] = require('./routes/index');
routes['users'] = require('./routes/users');
routes['universities'] = require('./routes/universities');
routes['about'] = require('./routes/about');

routes['apiUsers'] = require('./routes/apiUsers');
routes['apiUniversities'] = require('./routes/apiUniversities');
routes['apiMedia'] = require('./routes/apiMedia');

const PORT = process.env.PORT || 3000;
const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

const expressSwagger = require('express-swagger-generator')(app);
const options = {
  swaggerDefinition: {
    info: {
      description:
        'JSON HTTP API web server that provides access to resources from the repository',
      title: 'lab2 - JSON HTTP API Web Server',
      version: '1.0.0',
    },
    host: `localhost:${PORT}`,
    produces: ['application/json'],
  },
  basedir: __dirname,
  files: ['./routes/**/*.js', './models/**/*.js'],
};
expressSwagger(options);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes['index']);
app.use('/users', routes['users']);
app.use('/universities', routes['universities']);
app.use('/about', routes['about']);

app.use('/api/users', routes['apiUsers']);
app.use('/api/universities', routes['apiUniversities']);
app.use('/api/media', routes['apiMedia']);

app.listen(PORT, () => {
  console.log(`Server has been started on http://localhost:${PORT}`);
});
