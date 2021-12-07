const { Router } = require('express');
const router = Router();

const PORT = process.env.PORT || 3000;
const http = require('http');

router.get('/', (req, res) => {
	http.get(`http://localhost:${PORT}/api/users?limit=999`, async apiRes => {
		apiRes.setEncoding('utf8');
		let rawData = '';
		await apiRes.on('data', chunk => {
			rawData += chunk;
		});
		const users = JSON.parse(rawData);

		// console.log(users);
		res.render('user/users', {
			title: 'Users',
			isUsers: true,
			users,
		});
	});
});

router.get('/:id', (req, res) => {
	http.get(`http://localhost:${PORT}/api/users/${req.params.id}`, async apiRes => {
		apiRes.setEncoding('utf8');
		let rawData = '';
		await apiRes.on('data', chunk => {
			rawData += chunk;
		});
		const user = JSON.parse(rawData);

		res.render('user/user', {
			title: user.login,
			user,
		});
	});
});

module.exports = router;
