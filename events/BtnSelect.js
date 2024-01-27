const {
	Events, EmbedBuilder,
} = require('discord.js');
const { Captcha } = require('discord.js-captcha');
const client = require('../index');
const CaptchaDB = require('../Schema/Captcha');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		if (interaction.customId === 'btn-captcha') {
			const data = CaptchaDB.find({
				GuildId: interaction.guild.id,
			});
			let roleid;
			for await (const doc of data) {
				roleid = doc.RoleId;
			}
			const error = new EmbedBuilder()
				.setTitle('⚠ㅣ캡챠를 보내는데 실패했어요!')
				.setDescription(`서버 우클릭 -> 개인정보 보호 설정 -> '다이렉트 메세지'가 켜져 있는지 확인해주세요!\n'다이렉트 메세지'가 켜져 있는데도 되지 않는다면, 서버 관리자에게 권한 및 역할 확인을 요청해주세요! 서버 세팅이 잘못 되어 인증이 불가합니다! 관리자에게 문의해주세요.`)
				.setColor('Red')
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			if (roleid === undefined) return await interaction.reply({ embeds: [ error ], ephemeral: true });
			const captcha = new Captcha(client, {
				roleID: roleid,
				sendToTextChannel: false,
				addRoleOnSuccess: true,
				kickOnFailure: false,
				caseSensitive: true,
				attempts: 3,
				timeout: 30000,
				showAttemptCount: true,
				customPromptEmbed: new EmbedBuilder()
					.setTitle('✅ㅣ인증을 시작합니다!').setDescription('아래 영어 + 숫자를 이 채널의 DM에 대소문자를 구분하여 입력해주세요!').setColor('Green').setTimestamp(),
				customSuccessEmbed: new EmbedBuilder()
					.setTitle('✅ㅣ인증 완료!').setDescription(`인증이 완료되었습니다! 인증 역할이 지급되었어요!`).setColor('Green').setTimestamp(),
				customFailureEmbed: new EmbedBuilder()
					.setTitle('❌ㅣ인증에 실패했어요!').setDescription('캡챠 인증에 실패했어요! 다시 시도해주세요!').setColor('Red').setTimestamp(),
			});
			try {
				await interaction.deferReply({ ephemeral: true });
				await interaction.editReply({ content: '### ✅ㅣDM으로 인증 메시지를 전송해드렸어요!' });
				await captcha.present(interaction.member);
			} catch (err) {
				console.error(err);
			}
		}
	},
};