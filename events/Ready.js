const { ActivityType, Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 *
	 * @param {import('discord.js').Client} client
	 */
	async execute(client) {
		console.log(`${ client.user.tag } 로그인`);
		
		client.user.setActivity({
			name: `'/소개', 우설은 나의 적.`,
			type: ActivityType.Playing,
		});
	},
};
