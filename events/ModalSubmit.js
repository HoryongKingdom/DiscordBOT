const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const checkmark = interaction.client.emojis.cache.get(
			'1142775488054562948',
		);
		const cross = interaction.client.emojis.cache.get('1142775482132217868');
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId === 'modal-dev-ver') {
			try {
				const name = interaction.fields.getTextInputValue('modal-dev-ver-title');
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
				const crole = await interaction.guild.roles.create({
					name: '인증 역할',
					color: 'Green',
				});
				await interaction.reply({
					content: `${ checkmark }ㅣ**성공적으로 인증을 ${ interaction.channel }에 생성했어요!\n인증 역할(${ crole })을 생성했으니, 생성된 역할을 커스터마이징 해주세요!**`,
					components: [],
					ephemeral: true,
				});
				await interaction.channel.send({ embeds: [ embed ], components: [ button ] });
			} catch (error) {
				console.log(error);
				await interaction.reply(({
					content: `${ cross }ㅣ**인증을 생성하는 중에 예상치 못한 오류가 발생했어요! 봇의 권한을 확인하거나 고객센터에 문의해주세요! ||https://discord.gg/uCnSnwpYge||**`,
					ephemeral: true,
				}));
			}
		}
	},
};
