/**
 * @typedef University
 * @property {string} name.required - name of university
 * @property {string} country.required
 * @property {integer} numOfStudents
 * @property {integer} campus
 * @property {string} foundationDate - Date in ISO8601
 */

const uuidv4 = require('uuid-v4');

class University {
	constructor(
		uuid = uuidv4(),
		name,
		country,
		numOfStudents,
		campus,
		foundationDate
	) {
		this.uuid = uuid;
		this.name = name;
		this.country = country;
		this.numOfStudents = numOfStudents;
		this.campus = campus;
		this.foundationDate = foundationDate;
	}
}

module.exports = University;
