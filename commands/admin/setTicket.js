const {
	SlashCommandBuilder,
	ChannelType,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder, PermissionFlagsBits, ComponentType,
} = require('discord.js');
const mongoose = require('mongoose');
const TicketDB = require('../../Schema/Ticket');
const CaptchaDB = require('../../Schema/Captcha');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('티켓')
		.setDescription('[관리자] 티켓 기능을 사용할게요!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand.setName('추가').setDescription('[관리자] 티켓 기능을 시작할게요! 티켓 기능은 1개만 사용 가능합니다. (정식 업데이트 후 늘일 예정.)')
				.addStringOption(option => option.setName('이름').setDescription('티켓의 이름을 설정해주세요!').setRequired(true))
				.addChannelOption(option => option.setName('채널').setDescription('티켓 버튼을 생성할 곳을 선택해주세요!').setRequired(true).addChannelTypes(ChannelType.GuildText))
				.addChannelOption(option => option.setName('카테고리').setDescription('티켓 채널을 생성할 카테고리를 선택해주세요!').setRequired(true).addChannelTypes(ChannelType.GuildCategory))
				.addBooleanOption(option => option.setName('티켓제한').setDescription('유저당 이 티켓의 최대 생성수를 제한할지 선택해주세요!').setRequired(true))
				.addRoleOption(option => option.setName('멘션').setDescription('티켓을 열시 멘션할 역할을 선택해주세요! 이 역할은 티켓을 볼 권한이 생겨요!').setRequired(false)))
		// .addSubcommand(subcommand =>
		// 	subcommand.setName('설정').setDescription('[관리자] 티켓 기능을 설정할게요!'))
		.addSubcommand(subcommand =>
			subcommand.setName('삭제').setDescription('[관리자] 티켓 기능을 삭제할게요!')),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const data = TicketDB.find({ GuildId: interaction.guild.id });
		let guildid;
		for await (const doc of data) {
			guildid = doc.GuildId;
		}
		if (interaction.options.getSubcommand() === '추가') {
			const name = interaction.options.getString('이름');
			const channel = interaction.options.getChannel('채널');
			const category = interaction.options.getChannel('카테고리');
			const limit = interaction.options.getBoolean('티켓제한');
			const mention = interaction.options.getRole('멘션');
			
			const error = new EmbedBuilder()
				.setTitle('⚠ㅣ이미 티켓이 있어요!')
				.setDescription(`이미 ${ interaction.guild.name }에는 이미 1개 이상의 티켓이 있어요! **</티켓 삭제:1201049031753871451>로 티켓을 삭제 해주세요.**`)
				.setColor('Red')
				.setFooter({
					text: interaction.user.displayName,
					iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				})
				.setTimestamp();
			if (guildid !== undefined) return await interaction.reply({ embeds: [ error ], ephemeral: true });
			try {
				let ticketid = await TicketDB.countDocuments({ GuildId: interaction.guild.id });
				const database = await new TicketDB({
					_id: new mongoose.Types.ObjectId(),
					GuildId: interaction.guild.id,
					TicketId: ticketid + 1,
					TicketName: name,
					ChannelId: channel.id,
					CategoryId: category.id,
					IfOpened: limit,
					mention,
				});
				await database.save().catch(console.error);
				const embed = new EmbedBuilder()
					.setTitle(`🎫ㅣ${ name }`)
					.setDescription('티켓을 열려면 아래 버튼을 눌러주세요!')
					.setColor('#4f5fab')
					.setFooter({
						text: '이 기능은 아직 Beta에요! 오류가 발생한다면 서포트 서버에서 문의해주세요!',
						iconURL: 'https://images-ext-1.discordapp.net/external/6tVaUxectogf8lZc5X8fWTGd2tbzlG6I5AtVbWYYLNI/https/cdn.discordapp.com/embed/avatars/4.png?format=webp&quality=lossless',
					});
				const button = new ButtonBuilder()
					.setLabel('티켓 열기')
					.setEmoji('🎫')
					.setStyle(ButtonStyle.Secondary)
					.setCustomId(`btn-${ ticketid + 1 }`);
				const row = new ActionRowBuilder().addComponents(button);
				const msg = await channel.send({ embeds: [ embed ], components: [ row ] });
				await interaction.reply({ content: `### ✅ㅣ티켓 버튼을 생성했어요! 한번 확인해 보실래요? ${ msg }`, ephemeral: true });
			} catch (err) {
				const error1 = new EmbedBuilder()
					.setTitle('⚠ㅣ티켓 버튼을 전송하는데 오류가 발생했어요!')
					.setDescription(`${ channel }에 티켓 버튼을 작성하는데 권한이 없어요!\n\`채널 설정 -> 권한 -> 젠디 -> '메시지 보내기', '채널 보기'\`가 켜져있는지 확인해주세요!\n권한을 설정했는데도 되지 않는다면 서포트 서버에 문의해주세요!`)
					.setColor('Red')
					.setFooter({
						text: interaction.user.displayName,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					})
					.setTimestamp();
				await interaction.reply({ embeds: [ error1 ], ephemeral: true });
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
				await interaction.reply({ content: '### ⛔ㅣ티켓을 정말로 삭제하시겠습니까?', components: [ row ] });
				
				const filter = (i) => i.user.id === interaction.user.id;
				const collector = interaction.channel.createMessageComponentCollector({
					componentType: ComponentType.Button,
					filter,
					time: 5000,
				});
				collector.on('collect', async i => {
					if (i.customId === 'btn-captcha-delete') {
						await TicketDB.deleteOne(data);
						await i.reply({ content: '### ✅ㅣ티켓을 삭제했어요!', ephemeral: true });
					}
				});
				collector.on('end', async () => {
					button.setDisabled(true);
					await interaction.editReply({ content: '### ⛔ㅣ시간이 지나 사용이 불가합니다!', components: [ row ] });
				});
			} else {
				const error = new EmbedBuilder()
					.setTitle('⚠ㅣ티켓이 없는 것 같아요!')
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