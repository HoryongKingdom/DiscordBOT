const { Schema, model } = require('mongoose');

let captcha = new Schema({
	_id: Schema.Types.ObjectId,
	TicketId: Number,
	GuildId: String,
	TicketName: String,
	ChannelId: String,
	CategoryId: String,
	IfOpened: Boolean,
	mention: String,
});

module.exports = model('TicketSchema', captcha, 'TicketSchema');