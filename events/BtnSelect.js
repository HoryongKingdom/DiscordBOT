const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const user = interaction.user;
		if (interaction.customId === 'btn-dev-ver') {
			const ver = interaction.guild.commands.cache.get('1142777172378009650');
			const embed = new EmbedBuilder()
				.setTitle('✅ 인증 생성 명령어를 이용하세요!')
				.setDescription('대시보드로 인증 기능 사용을 현재 개발중에 있습니다. \'/관리자 인증생성\'을 대신 사용해주세요! 🙏\n빠른 시일 내에 해결하도록 노력하겠습니다. ❤')
				.setColor('#4f5fab')
				.setFooter({
					text: user.displayName,
					iconURL: user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp()
				.addFields({
					name: `${ ver }`,
					value: `>>> 인증을 생성하고, 사용합니다!`,
					inline: true,
				});
			await interaction.reply({ embeds: [ embed ], ephemeral: true });
		}
	},
};