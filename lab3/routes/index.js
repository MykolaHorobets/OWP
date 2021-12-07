const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
	res.render('index', {
		title: 'Home',
		isIndex: true,
	});
});

module.exports = router;
