const { Events } = require('discord.js');
const CaptchaDB = require('../Schema/Captcha');
const TicketDB = require('../Schema/Ticket');
const client = require('../index');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').Message} message
	 */
	async execute(message) {
		if (message.author.id === '757563116077711431' && message.content === '!서버 db 정리') {
			const data = CaptchaDB.find();
			let guildid = [];
			for await (const doc of data) {
				guildid.push(doc.GuildId);
			}
			const allserver = client.guilds.cache;
			let result = [];
			for (const value of guildid) {
				if (!allserver.has(value)) {
					await CaptchaDB.deleteOne({ GuildId: value });
					await TicketDB.deleteOne({ GuildId: value });
					result.push(value);
				}
			}
			await message.reply({ content: `### ✅ㅣ총 ${ result.length }개가 삭제되었습니다!` });
		}
	},
};