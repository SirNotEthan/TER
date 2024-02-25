const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('crime-report')
    .setDescription('Report a crime that has occured in-game'),
    async execute(interaction) {
        await interaction.deferReply()

        const LogsEmbed = new EmbedBuilder()
            .setTitle('Crime Report command was ran.')
            .addFields(
                { name: 'User', value: `${interaction.user.username}` },
                { name: 'UserID', value: `${interaction.user.id}` }
            )
            .setTimestamp()

        const Loggingchannel = interaction.client.channels.cache.get('1200946142498799667'); 
        Loggingchannel.send({ embeds: [LogsEmbed] });

        try {
            const CreateReport = new ButtonBuilder()
            .setLabel('Create Report')
            .setCustomId('CreateCrimeReportButton')
            .setStyle(ButtonStyle.Danger)

            const ViewReport = new ButtonBuilder()
            .setLabel('View Reports')
            .setCustomId('ViewCrimeReportButton')
            .setStyle(ButtonStyle.Secondary)

            const StartRow = new ActionRowBuilder()
            .addComponents(CreateReport, ViewReport)

            await interaction.editReply({ content: " ", components: [StartRow], epehermal: true })
        } catch (err) {
            console.log('Error Occurred: ', err)
        }

        const mainFilter = (interaction) => interaction.customId === 'CreateCrimeReportButton' || interaction.customId === 'ViewCrimeReportButton'

        const mainCollector = interaction.channel.createMessageComponentCollector({ filter: mainFilter });

        mainCollector.on('collect', async (interaction) => {
            if (interaction.customId === 'CreateCrimeReportButton') {
                const CreateReportModal = new ModalBuilder()
			    .setCustomId('CreateCrimeReportModal')
			    .setTitle('Create Crime Report');

                const reasonInput = new TextInputBuilder()
                .setCustomId('reasonInput')
                .setLabel('Reason for Crime Report')
                .setStyle(TextInputStyle.Paragraph)
                
                const usernameInput = new TextInputBuilder()
                .setCustomId('usernameInput')
                .setLabel('Roblox Username of suspect')
                .setStyle(TextInputStyle.Short)

                const evidenceInput = new TextInputBuilder()
                .setCustomId('evidenceInput')
                .setLabel('Evidence of Crime')
                .setStyle(TextInputStyle.Paragraph)

                const firstActionRow = new ActionRowBuilder().addComponents(reasonInput)
                const secondActionRow = new ActionRowBuilder().addComponents(usernameInput)
                const thirdActionRow = new ActionRowBuilder().addComponents(evidenceInput)

                CreateReportModal.addComponents(firstActionRow, secondActionRow, thirdActionRow)

                await interaction.showModal(CreateReportModal)
            }
        });
    }
}
