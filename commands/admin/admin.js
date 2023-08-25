const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle, ModalBuilder, TextInputBuilder,
	TextInputStyle,
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
				.addChoices({ name: '콘솔', value: 'console' }, { name: '인증생성', value: 'ver' }),
		),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const checkmark = interaction.client.emojis.cache.get(
			'1142775488054562948',
		);
		const cross = interaction.client.emojis.cache.get('1142775482132217868');
		const user = interaction.user;
		const category = interaction.options.getString('기능');
		if (category === 'console') {
			const embed = new EmbedBuilder()
				.setTitle('💠 관리자 기능 사용하기')
				.setDescription(
					'**젠디**의 관리자용 기능을 여기서 간편하게 사용할 수 있어요!',
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
					.setCustomId('btn-dev-ver')
					.setLabel('인증 생성')
					.setEmoji('✅')
					.setStyle(ButtonStyle.Secondary),
			);
			try {
				await interaction.reply({
					content: `${ checkmark }ㅣ**성공적으로 콘솔을 채널에 출력했어요!**`,
					ephemeral: true,
				});
				await interaction.channel.send({
					embeds: [ embed ],
					components: [ button ],
				});
			} catch (err) {
				await interaction.reply({
					content: `${ cross }ㅣ**콘솔을 출력하는 동안 오류가 발생했어요! [ERROR 'i-1']**`,
					ephemeral: true,
				});
			}
		} else if (category === 'ver') {
			const modal = new ModalBuilder()
				.setCustomId('modal-dev-ver')
				.setTitle('인증 생성');
			const title = new TextInputBuilder()
				.setCustomId('modal-dev-ver-title')
				.setPlaceholder('인증(임베드) 제목을 입력해주세요!')
				.setMinLength(2)
				.setRequired(true)
				.setLabel('제목')
				.setStyle(TextInputStyle.Short);
			const description = new TextInputBuilder()
				.setCustomId('modal-dev-ver-description')
				.setPlaceholder('인증(임베드) 설명을 입력해주세요!')
				.setMinLength(1)
				.setRequired(true)
				.setLabel('설명')
				.setStyle(TextInputStyle.Paragraph);
			const titleActionRow = new ActionRowBuilder().addComponents(title);
			const descriptionActionRow = new ActionRowBuilder().addComponents(description);
			modal.addComponents(titleActionRow, descriptionActionRow);
			
			const button = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId('btn-dev-ver-yes')
					.setLabel('생성하기')
					.setEmoji('✅')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('btn-dev-ver-no')
					.setLabel('취소하기')
					.setEmoji('⛔')
					.setStyle(ButtonStyle.Danger),
			);
			
			const msg = await interaction.reply({
				content: '**인증 기능을 현재 채널에 생성할까요?**',
				ephemeral: true,
				components: [ button ],
			});
			
			const collector = msg.createMessageComponentCollector({
				filter: (i) => i.user.id == interaction.user.id,
				max: 1,
			});
			collector.on('collect', async (inter) => {
				if (inter.customId === 'btn-dev-ver-yes') {
					await interaction.deleteReply();
					await inter.showModal(modal);
				} else if (inter.customId === 'btn-dev-ver-no') {
					await interaction.deleteReply();
				}
			});
		}
	},
};
