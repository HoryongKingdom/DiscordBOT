const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("유저정보")
    .setType(ApplicationCommandType.User),
  /**
   *
   * @param {import("discord.js").UserContextMenuCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.user;
    const User = interaction.targetUser;
    let bot;
    if (User.bot === true) {
      bot = "봇이에요!";
    } else {
      bot = "봇이 아니에요!";
    }
    let badge;
    if (User.flags.bitfield !== 0) {
      badge = User.flags.toArray().join(", ");
    } else {
      badge = "뱃지가 없어요!";
    }

    const embed = new EmbedBuilder()
      .setTitle(`🔰 ${User.displayName}님의 유저정보`)
      .setDescription(
        `**${User.username}**님의 정보를 가져왔어요! 아래를 확인해보시겠어요?`
      )
      .setColor("#4f5fab")
      .setFooter({
        text: user.displayName,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setThumbnail(`${User.displayAvatarURL({ dynamic: true })}`)
      .addFields(
        {
          name: "아이디",
          value: `>>> ${User.id}`,
          inline: true,
        },
        {
          name: "태그",
          value: `>>> ${User.username}`,
          inline: true,
        },
        {
          name: "이름",
          value: `>>> ${User.displayName}`,
          inline: true,
        },
        {
          name: "봇",
          value: `>>> ${bot}`,
          inline: true,
        },
        {
          name: "뱃지",
          value: `${badge}`,
          inline: true,
        }
      );
    await interaction.editReply({ embeds: [embed] });
  },
};
