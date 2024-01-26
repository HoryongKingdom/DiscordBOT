const { Schema, model } = require('mongoose');

let captcha = new Schema({
	_id: Schema.Types.ObjectId,
	GuildId: String,
	ChannelId: String,
	RoleId: String,
});

module.exports = model('CaptchaSchema', captcha, 'CaptchaSchema');