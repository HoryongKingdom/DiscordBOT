const {
	SlashCommandBuilder,
	EmbedBuilder,
	InteractionResponse,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('소개')
		.setDescription('TIGER BOT을 소개할게요!'),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const user = interaction.user;
		const userAvatarURL = user.avatarURL() || user.defaultAvatarURL;
		
		const embed = new EmbedBuilder()
			.setTitle('🎉 안녕! 저는 젠디에요!')
			.setDescription(
				`안녕하세요! **${ user.displayName }**님, 저는 **젠디**라고 해요\n**${ interaction.guild.name }**를 보호하기 위해 태어났어요!\n제 명령어가 궁금하신가요? <>`,
			)
			.setColor('#4f5fab')
			.setFooter({
				text: user.displayName,
				iconURL: user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp()
			.addFields(
				{
					name: '🏷 이름',
					value: `>>> 젠디`,
					inline: true,
				},
				{
					name: '👔 업무',
					value: '>>> 서버를 관리하고 보호하기',
					inline: true,
				},
				{
					name: '🎊 생일',
					value: '>>> 2월 1일 [2024/2/1]',
					inline: true,
				},
				{
					name: '🔮 좋아하는 것',
					value: `>>> ${ user.displayName }`,
					inline: true,
				},
				{
					name: '📛 싫어하는 것',
					value: `>>> **${ interaction.guild.name }**을 괴롭하는 악마`,
					inline: true,
				},
				{
					name: '🎡 MBTI',
					value: '>>> ENFP',
					inline: true,
				},
			);
		
		await interaction.reply({
			embeds: [ embed ],
		});
	},
};
