const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("유저")
    .setDescription("유저 정보 확인")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("정보")
        .setDescription(
          "선택한 유저의 정보를 확인해요! ['유저 우클릭 -> 앱 -> 유저정보'에서도 사용 가능해요!]"
        )
        .addUserOption((option) =>
          option
            .setName("유저")
            .setDescription("정보를 확인할 유저를 선택해주세요!")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("비공개")
            .setDescription("전송될 정보를 비공개로 전송할지 선택해주세요!")
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const user = interaction.user;
    const User = interaction.options.getUser("유저");
    let bot;
    if (User.bot == true) {
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
          value: ` ${User.id}`,
          inline: true,
        },
        {
          name: "태그",
          value: ` ${User.username}`,
          inline: true,
        },
        {
          name: "이름",
          value: ` ${User.displayName}`,
          inline: true,
        },
        {
          name: "봇",
          value: ` ${bot}`,
          inline: true,
        },
        {
          name: "뱃지",
          value: `${badge}`,
          inline: true,
        }
      );
    await interaction.reply({
      embeds: [embed],
      ephemeral: interaction.options.getBoolean("비공개"),
    });
  },
};
