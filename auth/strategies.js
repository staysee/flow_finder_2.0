'user strict'
const { Strategy: LocalStrategy } = require('passport-local');

//assigns the Strategy export to the name JwtStrategy using object destructuring
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const { User } = require('../models/users');
const { JWT_SECRET } = require('../config');

const localStrategy = new LocalStrategy((username, password, callback) => {

	let user;
	
	User.findOne({ username: username })
		.then(_user => {
			user = _user;
			if (!user) {
				//return a rejected promise so we break out of the chain of .thens
				//any errors like this will be handled in the catch block
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username or password'
				})
			}
			return user.validatePassword(password);
		})
		.then(isValid => {
			if (!isValid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username or password'
				})
			}
			return callback(null, user);
		})
		.catch(err => {
			if (err.reason === 'LoginError'){
				return callback(null, false, err);
			}
			return callback(err, false);
		})
})

const jwtStrategy = new JwtStrategy(
	{
		secretOrKey: JWT_SECRET,
		//look for the JWT as a Bearer auth header
		jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
		//only allow HS256 tokens - same as the ones we issue
		algorithms: ['HS256']
	},
	(payload, done) => {
		done(null, payload.user);
	}
);

module.exports = {localStrategy, jwtStrategy};








