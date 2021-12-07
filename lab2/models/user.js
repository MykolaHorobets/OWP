/**
 * @typedef User
 * @property {integer} uuid - - random unique id
 * @property {string} login.required - unique username
 * @property {string} fullname - some description here
 * @property {integer} role - 1 - admin, 0 - user
 * @property {string} avaUrl
 * @property {string} registeredAt - date of registration in ISO8601
 * @property {boolean} isEnabled - ban indicator
 */

class User {
	constructor(
		uuid,
		login,
		fullname,
		role = 0,
		registeredAt = new Date().toISOString(),
		avaUrl = '#',
		isEnabled = true
	) {
		this.uuid = uuid;
		this.login = login;
		this.fullname = fullname;
		this.role = role;
		this.registeredAt = registeredAt;
		this.avaUrl = avaUrl;
		this.isEnabled = isEnabled;
	}
}

module.exports = User;
