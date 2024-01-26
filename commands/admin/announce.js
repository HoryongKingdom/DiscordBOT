const {
	SlashCommandBuilder,
	PermissionFlagsBits, EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공지')
		.setDescription('[관리자] 공지를 작성해요.')
		.setDefaultMemberPermissions(PermissionFlagsBits.CreateEvents)
		.addChannelOption(option => option.setName('채널').setDescription('공지할 채널을 선택해주세요.').setRequired(true))
		.addStringOption(option => option.setName('제목').setDescription('공지의 제목을 입력해주세요.').setRequired(true))
		.addStringOption(option => option.setName('내용').setDescription('공지의 내용을 입력해주세요.').setRequired(true))
		.addRoleOption(option => option.setName('멘션').setDescription('멘션할 역할을 선택해주세요.').setRequired(false))
		.addAttachmentOption(option => option.setName('이미지').setDescription('사용할 이미지를 입력해주세요').setRequired(false)),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const channel = interaction.options.getChannel('채널');
		let embed = new EmbedBuilder();
		if (!interaction.options.getAttachment('이미지')) {
			embed = new EmbedBuilder()
				.setTitle(interaction.options.getString('제목'))
				.setDescription(interaction.options.getString('내용'))
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
		} else {
			embed = new EmbedBuilder()
				.setTitle(interaction.options.getString('제목'))
				.setDescription(interaction.options.getString('내용'))
				.setImage(interaction.options.getAttachment('이미지').url)
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
		}
		try {
			const success = new EmbedBuilder()
				.setTitle('✅ㅣ공지를 전송했어요!')
				.setColor('Green')
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			if (!interaction.options.getRole('멘션')) {
				const msg = await channel.send({ embeds: [ embed ] });
				success.setDescription(`성공적으로 ${ channel }에 메시지를 전송했어요! (${ msg.url }})\n확인 이모지 반응도 제가 달았으니 안심하세요 :)`);
				await interaction.reply({ embeds: [ success ], ephemeral: true });
				msg.react('✅');
			} else {
				const msg = await channel.send({
					content: `### 📢ㅣ${ interaction.options.getRole('멘션') }`,
					embeds: [ embed ],
				});
				msg.react('✅');
				success.setDescription(`성공적으로 ${ channel }에 메시지를 전송했어요! (${ msg.url }})\n확인 이모지 반응도 제가 달았으니 안심하세요 :)`);
				await interaction.reply({ embeds: [ success ], ephemeral: true });
			}
		} catch (err) {
			const error = new EmbedBuilder()
				.setTitle('⚠ㅣ공지를 전송하는데 오류가 발생했어요!')
				.setDescription(`${ channel }에 공지를 작성하는데 권한이 없어요!\n\`${ channel } 설정 -> 권한 -> 젠디 -> '메시지 보내기', '채널 보기'\`가 켜져있는지 확인해주세요!\n권한을 설정했는데도 되지 않는다면 서포트 서버에 문의해주세요!`)
				.setColor('Red')
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			await interaction.reply({ embeds: [ error ], ephemeral: true });
		}
	},
};
