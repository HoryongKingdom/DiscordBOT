const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').Message} message
	 */
	async execute(message) {
		if (message.channel.id === 1195348221002797137) {
		
		}
	},
};