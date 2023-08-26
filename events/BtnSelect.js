const { Events, EmbedBuilder } = require('discord.js');
const { Captcha } = require('discord.js-captcha');

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
		} else if (interaction.customId === 'btn-ver') {
			const crole = interaction.guild.roles.cache.find(role => role.name === '젠디 인증');
			if (crole != undefined || null) {
				if (interaction.member.roles.cache.has(crole.id) === false) {
					try {
						const captcha = new Captcha(interaction.client, {
							roleID: crole.id,
							sendToTextChannel: true,
							channelID: interaction.channel.id,
							addRoleOnSuccess: true,
							kickOnFailure: false,
							caseSensitive: true,
							attempts: 3,
							timeout: 30000,
							showAttemptCount: true,
							customPromptEmbed: new EmbedBuilder().setTitle(`캡챠 인증하기 - ${ interaction.user.displayName }`)
								.setDescription(
									'아래 이미지의 영어를 대소문자 구분해서 채팅창에 입력해주세요!',
								)
								.setColor('#4f5fab')
								.setTimestamp(),
							customSuccessEmbed: new EmbedBuilder().setTitle(`✅ 인증 성공! - ${ interaction.user.displayName }`)
								.setDescription(
									'인증 역할을 부여했어요! 서버에서 즐거운 시간 되세요!',
								)
								.setColor('#4f5fab')
								.setTimestamp(),
							customFailureEmbed: new EmbedBuilder().setTitle(`⛔ 인증 실패 - ${ interaction.user.displayName }`)
								.setDescription(
									'캡챠 인증을 다시 시도해주세요!',
								)
								.setColor('#4f5fab')
								.setTimestamp(),
						});
						await interaction.reply({
							content: `${ checkmark }ㅣ**캡챠 인증을 현재 채널로 전송할게요! 잠시만 기다려주세요!**`,
							ephemeral: true,
						});
						await captcha.present(interaction.member);
					} catch (err) {
						await interaction.reply(({
							content: `${ cross }ㅣ**인증을 출력하는 동안 오류가 발생했어요! [ERROR 'i-1']**`,
							ephemeral: true,
						}));
					}
				} else {
					await interaction.reply({ content: `${ cross }ㅣ**이미 인증을 완료했어요!**`, ephemeral: true });
				}
			} else {
				await interaction.reply({ content: `${ cross }ㅣ**인증 역할이 설정되지 않았습니다! 서버 관리자에게 문의해주세요!**`, ephemeral: true });
			}
		}
	},
};