const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
	ButtonStyle,
	ButtonBuilder, ActionRowBuilder,
	ComponentType,
} = require('discord.js');
const CaptchaDB = require('../../Schema/Captcha');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('인증')
		.setDescription('[관리자] 인증 기능을 사용할게요!')
		.addSubcommand(subcommand => subcommand.setName('설정').setDescription('인증 기능을 시작할게요! 인증 버튼은 1개만 사용 가능합니다.').addChannelOption(option => option.setName('채널').setDescription('인증 버튼을 생성하려는 채널을 선택 해주세요!').setRequired(true)).addRoleOption(option => option.setName('역할').setDescription('인증 완료 시 지급할 역할을 선택 해주세요!').setRequired(true)))
		.addSubcommand(subcommand => subcommand.setName('삭제').setDescription('인증 기능을 삭제할게요! 인증 버튼은 1개만 사용 가능합니다.'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const data = CaptchaDB.find({ GuildId: interaction.guild.id });
		let guildid, channelid;
		for await(const doc of data) {
			guildid = doc.GuildId;
			channelid = doc.ChannelId;
		}
		if (interaction.options.getSubcommand() === '설정') {
			const error = new EmbedBuilder()
				.setTitle('⚠ㅣ이미 인증 버튼이 있어요!')
				.setDescription(`이미 ${ interaction.guild.name }에는 <#${ channelid }>에 인증 버튼이 있어요! **</인증 삭제:1200318998823321610>로 인증 버튼을 삭제 해주세요.**`)
				.setColor('Red')
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			if (guildid !== undefined) return await interaction.reply({ embeds: [ error ], ephemeral: true });
			const channel = interaction.options.getChannel('채널');
			const role = interaction.options.getRole('역할');
			const embed = new EmbedBuilder()
				.setTitle('✅ㅣ인증')
				.setDescription(`${ interaction.guild.name }에서 활동하려면 인증을 해야해요!\n아래 버튼을 누르고 인증을 시작할게요!`)
				.setColor('Green')
				.setFooter({
					text: '이 기능은 아직 Beta에요! 오류가 발생한다면 서포트 서버에서 문의해주세요!',
					iconURL: 'https://images-ext-1.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png?format=webp&quality=lossless',
				});
			const button = new ButtonBuilder()
				.setLabel('인증하기')
				.setEmoji('✅')
				.setStyle(ButtonStyle.Success)
				.setCustomId('btn-captcha');
			const row = new ActionRowBuilder().addComponents(button);
			try {
				const data = await new CaptchaDB({
					_id: new mongoose.Types.ObjectId(),
					GuildId: interaction.guild.id,
					ChannelId: channel.id,
					RoleId: role.id,
				});
				data.save().catch(console.error);
				const msg = await channel.send({ embeds: [ embed ], components: [ row ] });
				await interaction.reply({ content: `### ✅ㅣ인증 버튼을 생성했어요! 한번 확인해 보실래요? ${ msg }`, ephemeral: true });
			} catch (err) {
				const error = new EmbedBuilder()
					.setTitle('⚠ㅣ인증 버튼을 전송하는데 오류가 발생했어요!')
					.setDescription(`${ channel }에 인증 버튼을 작성하는데 권한이 없어요!\n\`채널 설정 -> 권한 -> 젠디 -> '메시지 보내기', '채널 보기'\`가 켜져있는지 확인해주세요!\n권한을 설정했는데도 되지 않는다면 서포트 서버에 문의해주세요!`)
					.setColor('Red')
					.setFooter({
						text: interaction.user.displayName,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					})
					.setTimestamp();
				await interaction.reply({ embeds: [ error ], ephemeral: true });
				console.error(err);
			}
		} else if (interaction.options.getSubcommand() === '삭제') {
			if (guildid === interaction.guild.id) {
				const button = new ButtonBuilder()
					.setLabel('삭제하기')
					.setEmoji('⛔')
					.setStyle(ButtonStyle.Danger)
					.setCustomId('btn-captcha-delete');
				const row = new ActionRowBuilder().addComponents(button);
				await interaction.reply({ content: '### ⛔ㅣ인증 버튼을 정말로 삭제하시겠습니까?', components: [ row ] });
				
				const filter = (i) => i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({
					componentType: ComponentType.Button,
					filter,
					time: 5000,
				});
				collector.on('collect', async i => {
					if (i.customId === 'btn-captcha-delete') {
						await CaptchaDB.deleteOne(data);
						await i.reply({ content: '### ✅ㅣ인증 버튼을 삭제했어요!', ephemeral: true });
					}
				});
				collector.on('end', () => {
					button.setDisabled(true);
					interaction.editReply({ content: '### ⛔ㅣ시간이 지나 사용이 불가합니다!', components: [ row ] });
				});
			} else {
				const error = new EmbedBuilder()
					.setTitle('⚠ㅣ인증 버튼이 없는 것 같아요!')
					.setDescription(`${ interaction.guild } 서버에는 인증 버튼이 없는 것 같아요! </인증 설정:1200318998823321610>으로 인증 버튼을 생성해주세요!`)
					.setColor('Red')
					.setFooter({
						text: '이 기능은 아직 Beta에요! 오류가 발생한다면 서포트 서버에서 문의해주세요!',
						iconURL: 'https://images-ext-1.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png?format=webp&quality=lossless',
					});
				await interaction.reply({ embeds: [ error ], ephemeral: true });
			}
		}
	},
};