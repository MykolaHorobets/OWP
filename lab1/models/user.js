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
