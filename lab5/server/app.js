const config = require('./config');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const corsMiddleware = require('./middleware/cors.middleware');

const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const universityRouter = require('./routes/universities');

const PORT = config.port;
const mongodbUri = config.mongodbUri;

app.use(corsMiddleware);
app.use(
	fileUpload({
		createParentPath: true,
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/universities', universityRouter);

app.ws('/', (ws, req) => {
	console.log('Connection established!');

	ws.on('message', msg => {
		msg = JSON.parse(msg);
		switch (msg.method) {
			case 'connection':
				connectionHandler(ws, msg);
				break;
			case 'create':
				broadcastConnection(ws, msg);
				break;
		}
	});
});

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

function connectionHandler(ws, msg) {
	ws.id = msg.userId;
	broadcastConnection(ws, msg);
}

function broadcastConnection(ws, msg) {
	console.log('Message:', msg);

	aWss.clients.forEach(client => {
		if (client.id !== msg.userId) {
			client.send(JSON.stringify(msg));
		}
	});
}
