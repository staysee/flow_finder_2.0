'use strict'

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');


const eventRouter = require('./routes/eventRouter');
const userRouter = require('./routes/userRouter');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { Event } = require('./models/events');
const { User } = require('./models/users');
const { DATABASE_URL, PORT } = require('./config');


const jsonParser = bodyParser.json();
const app = express();


app.use(morgan('common'));
app.use(express.static('public'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);	//register our local auth strategy	
passport.use(jwtStrategy);		//register our JWT strategy

app.use('/api/users', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/auth', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false }); 	//stop Passport from adding session cookies

//protected endpoint that needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
	return res.json({
		data: 'rosebud'
	})
})


// catch-all endpoint if client makes request to non-existent endpoint
app.use('*', (req, res) => {
	res.status(404).json({message: 'Endpoint Not Found'});
})



// OPEN/CLOSE SERVER
let server;

function runServer(databaseUrl, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}

			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer }; 



