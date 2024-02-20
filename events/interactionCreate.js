const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Profile = require('../models/economySchema');
const HouseProfile = require('../models/houseEconomySchema');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, interaction.client); 
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }   
        } else if (interaction.isButton()) {
            console.log('Hello World')
        } else if (interaction.isModalSubmit()) {
            if (interaction.customId === 'CreateCrimeReportModal') {
                const reasonValue = interaction.fields.getTextInputValue('reasonInput');
                const usernameValue = interaction.fields.getTextInputValue('usernameInput');
                const evidenceValue = interaction.fields.getTextInputValue('evidenceInput');


                const ConfirmationEmbed = new EmbedBuilder()
                    .setTitle('Crime Report Confirmation')
                    .setColor('Orange')
                    .setDescription('The following information will be submitted.')
                    .addFields(
                        { name: 'Author:', value: `<@${interaction.user.id}> (${interaction.user.id})` },
                        { name: 'Suspect:', value: `${usernameValue}` },
                        { name: 'Evidence:', value: `${evidenceValue}`},
                        { name: 'Reason:', value: `${reasonValue}`}
                    )
                    .setTimestamp();

                const CrimeConfirmationButton = new ButtonBuilder()
                    .setLabel('Confirm')
                    .setCustomId('CrimeConfirmationButton')
                    .setStyle(ButtonStyle.Success);

                const CrimeCancelButton = new ButtonBuilder()
                    .setLabel('Cancel')
                    .setCustomId('CrimeCancelButton')
                    .setStyle(ButtonStyle.Danger);

                const ConfirmationRow = new ActionRowBuilder()
                    .addComponents(CrimeConfirmationButton, CrimeCancelButton);

                await interaction.reply({ embeds: [ConfirmationEmbed], components: [ConfirmationRow] });
            }

            if (interaction.isButton()) {
                if (interaction.customId === "CrimeConfirmationButton") {
                    const CrimeSuccessEmbed = new EmbedBuilder()
                        .setTitle('Crime Reported!')
                        .setColor('Green')
                        .setDescription('Your Crime was successfully reported')
                        .setTimestamp();
    
                    await interaction.message.edit({ embeds: [CrimeSuccessEmbed], components: [] });
    
                    const CrimeReportChannel = interaction.client.channels.cache.get('1205608307822297209'); 
                    await CrimeReportChannel.send({ embeds: [ConfirmationEmbed] });
                } else if (interaction.customId === "CrimeCancelButton") {
                    const CrimeCancelledEmbed = new EmbedBuilder()
                        .setTitle('Crime Report Cancelled')
                        .setColor('Red')
                        .setDescription('Your Crime Report was not submitted.')
                        .setTimestamp();
    
                    await interaction.message.edit({ embeds: [CrimeCancelledEmbed], components: [] });
                }
            }
        }
    }
};