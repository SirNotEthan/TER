const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('order')
        .setDescription('Make a new order'),
    async execute(interaction) {
        const CreateOrderModal = new ModalBuilder()
		    .setCustomId('CreateOrderModal')
			.setTitle('Create New Order');

        const usernameInput = new TextInputBuilder()
            .setCustomId('usernameInput')
            .setLabel('UserID of user making the order')
            .setStyle(TextInputStyle.Short)
                
        const orderInput = new TextInputBuilder()
            .setCustomId('orderInput')
            .setLabel('Items ordered.')
            .setStyle(TextInputStyle.Paragraph)

        const paymentTypeInput = new TextInputBuilder()
            .setCustomId('paymentTypeInput')
            .setLabel('Payment type used.')
            .setStyle(TextInputStyle.Short)

        const firstActionRow = new ActionRowBuilder().addComponents(usernameInput)
        const secondActionRow = new ActionRowBuilder().addComponents(orderInput)
        const thirdActionRow = new ActionRowBuilder().addComponents(paymentTypeInput)

        CreateOrderModal.addComponents(firstActionRow, secondActionRow, thirdActionRow)
        await interaction.showModal(CreateOrderModal)
    }
};