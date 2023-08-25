const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId === 'modal-dev-ver') {
			try {
				const name = interaction.fields.getTextInputValue('modal-dev-ver-name');
				const description = interaction.fields.getTextInputValue('modal-dev-ver-description');
				const embed = new EmbedBuilder()
					.setTitle(name)
					.setDescription(description)
					.setColor('Green');
				const button = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('btn-ver')
						.setLabel('인증하기')
						.setEmoji('✅')
						.setStyle(ButtonStyle.Success),
				);
				await interaction.editReply({
					content: `${ checkmark }ㅣ**성공적으로 인증을 ${ interaction.channel }에 생성했어요!`,
					components: [],
				});
				await interaction.channel.send({ embeds: [ embed ], components: [ button ] });
			} catch (error) {
				console.log(error);
				await interaction.editReply(({ content: `${ cross }ㅣ**인증을 생성하는 중에 예상치 못한 오류가 발생했어요! 봇의 권한을 확인하거나 고객센터에 문의해주세요! ||https://discord.gg/uCnSnwpYge||**` }));
			}
		}
	},
};
