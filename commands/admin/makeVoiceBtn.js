const {
	SlashCommandBuilder,
	PermissionFlagsBits, EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('공지')
		.setDescription('[관리자] 공지를 작성해요.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(option => option.setName('제목').setDescription('공지의 제목을 입력해주세요.').setRequired(true))
		.addStringOption(option => option.setName('내용').setDescription('공지의 내용을 입력해주세요.').setRequired(true))
		.addRoleOption(option => option.setName('멘션').setDescription('어떤 역할을 멘션할까요?').setRequired(false))
		.addAttachmentOption(option => option.setName('이미지').setDescription('사용할 이미지를 입력해주세요').setRequired(false)),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const channel = interaction.guild.channels.cache.get('1185874777051766905');
		let embed = new EmbedBuilder();
		if (!interaction.options.getAttachment('이미지')) {
			embed = new EmbedBuilder()
				.setTitle(interaction.options.getString('제목'))
				.setDescription(interaction.options.getString('내용'));
		} else {
			embed = new EmbedBuilder()
				.setTitle(interaction.options.getString('제목'))
				.setDescription(interaction.options.getString('내용'))
				.setImage(interaction.options.getAttachment('이미지').url);
		}
		if (!interaction.options.getRole('멘션')) {
			const msg = await channel.send({ embeds: [ embed ] });
			await interaction.reply({ content: `### ✅ㅣ공지를 전송했어요!` });
			msg.react('✅');
		} else {
			const msg = await channel.send({
				content: `### 📢ㅣ${ interaction.options.getRole('멘션') }`,
				embeds: [ embed ],
			});
			msg.react('✅');
			await interaction.reply({ content: `### ✅ㅣ공지를 전송했어요!` });
		}
	},
};
