const { ActivityType, Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  /**
   *
   * @param {import('discord.js').Client} client
   */
  async execute(client) {
    console.log(`${client.user.tag} 로그인`);

    client.user.setActivity({
      name: `'/도움말'로 봇 사용!`,
      type: ActivityType.Playing,
    });
  },
};
