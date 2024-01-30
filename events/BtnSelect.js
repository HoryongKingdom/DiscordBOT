const {
	Events, EmbedBuilder, ChannelType, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ComponentType, ButtonStyle,
} = require('discord.js');
const { Captcha } = require('discord.js-captcha');
const client = require('../index');
const CaptchaDB = require('../Schema/Captcha');
const TicketDB = require('../Schema/Ticket');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		if (!interaction.isButton()) return;
		const data = TicketDB.find({ GuildId: interaction.guild.id });
		let ticketid;
		for await (const doc of data) {
			ticketid = doc.TicketId;
		}
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
			await interaction.deferReply({ ephemeral: true });
			try {
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
				await interaction.editReply({ content: '### ✅ㅣDM으로 인증 메시지를 전송해드렸어요! 디스코드 API 문제로 메시지가 지연될 수 있어요!' });
				await captcha.present(interaction.member);
			} catch (err) {
				await interaction.editReply({ embeds: [ error ] });
				console.error(err);
			}
		} else if (interaction.customId === `btn-${ ticketid }`) {
			const data = TicketDB.find({ TicketId: ticketid });
			let name, channel, category, ifopened, mention;
			for await(const doc of data) {
				name = doc.TicketName;
				channel = doc.ChannelId;
				category = doc.CategoryId;
				ifopened = doc.IfOpened;
				mention = doc.mention;
			}
			try {
				const button = new ButtonBuilder()
					.setLabel('티켓 닫기')
					.setEmoji('💥')
					.setStyle(ButtonStyle.Danger)
					.setCustomId('btn-ticket-close');
				const row = new ActionRowBuilder().addComponents(button);
				if (mention === null) {
					const make = await interaction.guild.channels.create({
						name: `${ name }-${ interaction.user.displayName }`,
						type: ChannelType.GuildText,
						parent: category,
						permissionOverwrites: [
							{
								id: interaction.guild.id,
								deny: [ PermissionsBitField.Flags.ViewChannel ],
							},
							{
								id: interaction.user.id,
								allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ],
							},
							{
								id: '1199715583940362290',
								allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ],
							},
						],
					});
					await make.send({
						content: `### ${ interaction.user }님이 티켓을 열었어요! 내용을 입력 후 기다려주세요 :)\n티켓을 닫으려면 아래의 버튼을 눌러주세요!\n이 티켓의 번호: +${ ticketid }`,
						components: [ row ],
					});
					await interaction.reply({ content: `### ✅ㅣ${ make }에 티켓을 열었어요! 이동해주세요!`, ephemeral: true });
				} else {
					const make = await interaction.guild.channels.create({
						name: `${ name }-${ interaction.user.displayName }`,
						type: ChannelType.GuildText,
						parent: category,
						permissionOverwrites: [
							{
								id: interaction.guild.id,
								deny: [ PermissionsBitField.Flags.ViewChannel ],
							},
							{
								id: mention,
								allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ],
							},
							{
								id: interaction.user.id,
								allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages ],
							},
							{
								id: '1199715583940362290',
								allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels ],
							},
						],
					});
					await make.send({
						content: `### ${ interaction.user }님이 티켓을 열었어요! <&${ mention }>을 호출했으니 내용을 입력 후 기다려주세요 :)\n티켓을 닫으려면 아래의 버튼을 눌러주세요!\n이 티켓의 번호: +${ ticketid }`,
						components: [ row ],
					});
					await interaction.reply({ content: `### ✅ㅣ${ make }에 티켓을 열었어요! 이동해주세요!`, ephemeral: true });
				}
			} catch (err) {
				const error = new EmbedBuilder()
					.setTitle('⚠ㅣ티켓을 만드는데 실패했어요!')
					.setDescription(`서버 관리자에게 권한 및 채널, 카테고리 확인을 요청해주세요! 서버 세팅이 잘못 되어 티켓 생성이 불가합니다! 관리자에게 문의해주세요.`)
					.setColor('Red')
					.setFooter({
						text: interaction.user.displayName,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					})
					.setTimestamp();
				await interaction.reply({ embeds: [ error ], ephemeral: true });
				console.log(err);
			}
		} else if (interaction.customId === 'btn-ticket-close') {
			await interaction.deferReply();
			try {
				if (interaction.channel.name.includes('보관')) return await interaction.editReply({ content: '### ❌ㅣ이미 보관 처리 된것 같아요!' });
				await CaptchaDB.deleteOne(data);
				await interaction.editReply({ content: '### ✅ㅣ티켓을 보관처리 했어요!\n티켓 삭제는 직접 채널을 삭제해주세요!\n티켓 삭제 및 보관 처리 기능은 추후에 추가될 예정입니다.' });
				await interaction.channel.setName(`보관-${ interaction.channel.name }`);
				await interaction.channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: false });
				await interaction.channel.permissionOverwrites.edit(interaction.user.id, { SendMessages: false });
			} catch (err) {
				await interaction.editReply({ content: '### ❌ㅣ젠디가 티켓을 닫을 권한이 없습니다!' });
				console.log(err);
			}
		}
	},
};