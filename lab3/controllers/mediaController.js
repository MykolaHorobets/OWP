const MediaRepository = require('../repositories/mediaRepository');
const mediaRepository = new MediaRepository('data/media.json');

module.exports = {
	apiPostMedia(req, res) {
		try {
			if (!req.files) {
				res.send({
					status: false,
					message: 'No file uploaded',
				});
			} else {
				const image = {};
				image['id'] = req.files['unImage'].md5;
				image['path'] = `./uploads/${req.files['unImage'].name}`;

				const images = mediaRepository.getMedia();
				const isImage = images.find(img => img.id === image.id);

				if (!isImage) {
					req.files['unImage'].mv('./uploads/' + req.files['unImage'].name);
					images.push(image);
					mediaRepository.addMedia(images);
					res.send(req.files);
				} else
					res.send({
						status: false,
						message: 'This file is already uploaded',
					});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	},

	apiGetMedia(req, res) {
		const image = mediaRepository.getMediaById(req.params.id);
		if (image) {
			res.set({ 'Content-Type': 'image/png' });
			res.send(image);
		} else res.status(404).send('This id is missing');
	},
};
