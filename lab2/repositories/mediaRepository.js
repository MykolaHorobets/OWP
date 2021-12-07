const JsonStorage = require('../jsonStorage');
const fs = require('fs');

class MediaRepository {
	constructor(filePath) {
		this.storage = new JsonStorage(filePath);
	}

	getMedia() {
		return this.storage.readItems();
	}

	getMediaById(id) {
		for (const item of this.storage.readItems()) {
			if (item.id === id) {
				return fs.readFileSync(item.path);
			}
		}
		return null;
	}

	addMedia(mediaModel) {
		this.storage.writeItems(mediaModel);
	}
}

module.exports = MediaRepository;
