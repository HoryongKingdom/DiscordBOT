const {
	Events,
	EmbedBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
} = require('discord.js');
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
		if (interaction.customId === 'btn-voice') {
			const modal = new ModalBuilder()
				.setTitle('음성 방 설정하기')
				.setCustomId('modal-voice');
			const title = new TextInputBuilder()
				.setCustomId('modal-voice-title')
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(10)
				.setLabel('음성 방의 이름을 설정해주세요!')
				.setPlaceholder('\'/음성방 이름변경\'으로 추후 변경 가능.');
			const people = new TextInputBuilder()
				.setCustomId('modal-voice-people')
				.setRequired(false)
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(2)
				.setLabel('음성 방의 인원 수를 설정해주세요! (0일시 무제한)')
				.setPlaceholder('\'/음성방 인원변경\'으로 추후 변경 가능.');
			const mention = new TextInputBuilder()
				.setCustomId('modal-voice-mention')
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(8)
				.setLabel('어느 사람을 멘션할까요?')
				.setPlaceholder('[no/here/everyone/멤버/컨텐츠팀] 중 입력');
			const titleup = new ActionRowBuilder().addComponents(title);
			const peopleup = new ActionRowBuilder().addComponents(people);
			const mentionup = new ActionRowBuilder().addComponents(mention);
			modal.addComponents(titleup, peopleup, mentionup);
			await interaction.showModal(modal);
		}
	},
};