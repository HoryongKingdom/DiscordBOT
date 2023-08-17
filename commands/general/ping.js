const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("핑")
    .setDescription("현재 봇의 상태를 출력해요!"),
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const user = interaction.user;
    const userAvatarURL = user.avatarURL() || user.defaultAvatarURL;

    const embed = new EmbedBuilder()
      .setTitle("🏓 퐁!")
      .setDescription("**젠디**의 봇 상태를 보여드릴게요!")
      .setColor("#4f5fab")
      .setFooter({
        text: user.username,
        iconURL: userAvatarURL,
      })
      .setTimestamp()
      .addFields(
        {
          name: "🥏 응답 핑",
          value: `>>> ${interaction.client.ws.ping}ms`,
          inline: true,
        },
        {
          name: "🧩 샤드 정보",
          value: ">>> 사용중인 샤드 : `1개`",
          inline: true,
        },
        {
          name: "샤드 #1",
          value:
            ">>> **상태**: <샤드 상태(연결됨, 정상)>\n**사드 핑**: <샤드 핑>\n`💫 이 서버는 [샤드 #1]에 연결되어 있습니다.`",
          inline: false,
        }
      );

    await interaction.reply({
      embeds: [embed],
    });
  },
};
