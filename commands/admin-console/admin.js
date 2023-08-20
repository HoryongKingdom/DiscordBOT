const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('관리자')
    .setDescription('관리자 기능을 사용합니다!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ViewGuildInsights)
    .addStringOption((option) =>
      option
        .setName('기능')
        .setDescription('사용할 기능을 선택해주세요!')
        .setRequired(true)
        .addChoices({ name: '콘솔', value: 'console' })
    ),
  /**
   *
   * @param {import('discord.js').CommandInteraction} interaction
   */
  async execute(interaction) {
    const checkmark = interaction.client.emojis.cache.get(
      '1142775488054562948'
    );
    const cross = interaction.client.emojis.cache.get('1142775482132217868');
    const user = interaction.user;
    const category = interaction.options.getString('기능');
    if (category === 'console') {
      const embed = new EmbedBuilder()
        .setTitle('💠 관리자 기능 사용하기')
        .setDescription(
          '**젠디**의 관리자용 기능을 여기서 간편하게 사용할 수 있어요!'
        )
        .setColor('#4f5fab')
        .setFooter({
          text: user.displayName,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .addFields({
          name: '✅ 인증 생성',
          value: `>>> 인증을 생성하고, 사용합니다!`,
          inline: true,
        });
      const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('인증 생성')
          .setEmoji('✅')
          .setCustomId('btn-dev-ver')
          .setStyle(ButtonStyle.Secondary)
      );
      try {
        await interaction.reply({
          content: `${checkmark}ㅣ**성공적으로 콘솔을 채널에 출력했어요!**`,
          ephemeral: true,
        });
        await interaction.channel.send({
          embeds: [embed],
          components: [button],
        });
      } catch (err) {
        await interaction.reply({
          content: `${cross}ㅣ**콘솔을 출력하는 동안 오류가 발생했어요! [ERROR 'i-1']**`,
          ephemeral: true,
        });
      }
    }
  },
};
