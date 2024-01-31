const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('청소')
		.setDescription('[관리자] 원하는 채널의 메세지를 삭제합니다.')
		.setDefaultMemberPermissions(PermissionsBitField.Administrator)
		.addIntegerOption(option => option.setName('개수').setDescription('청소할 개수를 입력해주세요! (1~100)').setMaxValue(100).setMinValue(1).setRequired(true))
		.addChannelOption(option => option.setName('채널').setDescription('청소를 원하는 채널을 선택해주세요!').addChannelTypes(ChannelType.GuildText).setRequired(false)),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const amount = interaction.options.getInteger('개수');
		let channel = interaction.options.getChannel('채널');
		if (!channel) {
			channel = interaction.channel;
		}
		const messages = await channel.messages.fetch({ limit: amount });
		try {
			await channel.bulkDelete(messages);
			const msg = await interaction.reply({ content: `### ✅ㅣ${ channel }에 총 ${ amount }개의 메시지를 삭제했어요!` });
			setTimeout(() => {
				msg.delete();
			}, 2000);
		} catch (err) {
			await interaction.reply({ content: `### ❌ㅣ${ channel }에 젠디가 메세지를 관리할 권한이 없어요!` });
		}
	},
};