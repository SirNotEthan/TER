const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js') 
const AOS = require('../../models/AOSSchema')

// Object to store AOS data
const activeAOSTargets = {};
AOS.find().then(targets => {
    targets.forEach(target => {
        activeAOSTargets[target.ID] = {
            username: target.Username,
            reason: target.Reason,
            severity: target.Severity
        };
    });
}).catch(error => {
    console.error('Error loading active AOS targets:', error);
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aos')
        .setDescription('New Update')
        .addSubcommand((subcommand) => subcommand
            .setName('create')
            .setDescription('Create a new AOS target')
            .addStringOption((option) => option
                .setName('username')
                .setDescription('Roblox Username of Suspect')
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('reason')
                .setDescription('Reason for AOS')
                .setRequired(true)
            )
            .addIntegerOption((option) => option 
                .setName('severity')
                .setDescription('Severity level from 1 - 5')
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName('remove')
            .setDescription('Remove the existing AOS target')
            .addStringOption((option) => option
                .setName('id')
                .setDescription('The ID of the AOS target')
                .setRequired(true)
            )
            .addStringOption((option) => option
                .setName('reason')
                .setDescription('Reason of Removal')
                .setRequired(true)
            )
        ),
    async execute(interaction, client) {
        await interaction.deferReply()

        if (!interaction.member.roles.cache.some(role => role.name === 'City Watch')) {
            return interaction.editReply('You do not have permission to use this command.');
        }

        const LogsEmbed = new EmbedBuilder()
            .setTitle('AOS Command was ran.')
            .addFields(
                { name: 'User', value: `${interaction.user.username}` },
                { name: 'UserID', value: `${interaction.user.id}` }
            )
            .setTimestamp()

        const Loggingchannel = client.channels.cache.get('1200946142498799667'); 
        Loggingchannel.send({ embeds: [LogsEmbed] });

        const subcommands = interaction.options.getSubcommand();

        if (subcommands === "create") {
            const username = interaction.options.getString('username');
            const reason = interaction.options.getString('reason');
            const severity = interaction.options.getInteger('severity');

            let NewID;
            do {
                NewID = Math.floor(Math.random() * 10000000000); 
            } while (activeAOSTargets[NewID]);

            activeAOSTargets[NewID] = { username, reason, severity };

            try {
                await AOS.create({
                    ID: NewID,
                    Username: username,
                    Reason: reason,
                    Severity: severity
                });

                let EmbedColor;

                if (severity === 1) {
                    EmbedColor = "#00FF00";
                } else if (severity === 2 || severity === 3) {
                    EmbedColor = "#FFA500";
                } else if (severity === 4 || severity === 5) {
                    EmbedColor = "#FF0000";
                }

                const AOSEmbed = new EmbedBuilder()
                    .setTitle('AOS Target')
                    .setDescription('ALERT: New AOS Target')
                    .setColor(EmbedColor)
                    .addFields(
                        { name: "Author", value: `<@${interaction.user.id}> (${interaction.user.id})` },
                        { name: "Suspect's Username", value: `${username}` },
                        { name: "Reason", value: `${reason}` },
                        { name: "Severity", value: `${severity}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: `AOS_ID: ${NewID}` });

                const CompletedButton = new ButtonBuilder()
                    .setCustomId('CompletedAOSButton')
                    .setLabel('Completed')
                    .setStyle(ButtonStyle.Success);

                const AOSEmbedRow = new ActionRowBuilder()
                    .addComponents(CompletedButton);

                const AOSchannel = client.channels.cache.get('1205609055570366565'); 
                AOSchannel.send({ embeds: [AOSEmbed], components: [AOSEmbedRow] });
                return interaction.editReply({ content: `AOS Target Created: ${NewID}`, ephemeral: true });
            } catch(error) {
                console.error('Error creating an AOS target:', error);
                interaction.editReply('Error creating an AOS target, Contact Staff is this message appears.');
            }
        } else if (subcommands === "remove") {
            const id = interaction.options.getString('id');
            const reason = interaction.options.getString('reason');

            const existingAOS = await AOS.findOne({ ID: id });
            if (existingAOS) {
                await AOS.findOneAndDelete({ ID: id });
                delete activeAOSTargets[id]; // Remove from active targets
                return interaction.editReply(`Removed AOS_ID: ${id}\n Reason: ${reason}`);
            } else {
                return interaction.editReply(`AOS_ID: ${id} does not exist.`);
            }
        }

        const mainFilter = (interaction) => interaction.customId === 'CompletedAOSButton';

        const mainCollector = interaction.channel.createMessageComponentCollector({ filter: mainFilter });

        mainCollector.on('collect', async (interaction) => {
            if (interaction.customId === 'CompletedAOSButton') {
                const { username, reason, severity } = activeAOSTargets[id];
                
                const CompletedEmbed = new EmbedBuilder()
                    .setDescription('ALERT: New AOS Target Completed')
                    .setColor('Black')
                    .addFields(
                        { name: "Completed By", value: `<@${interaction.user.id}> (${interaction.user.id})` },
                        { name: "Author", value: `<@${interaction.user.id}> (${interaction.user.id})` },
                        { name: "Suspect's Username", value: `${username}` },
                        { name: "Reason", value: `${reason}` },
                        { name: "Severity", value: `${severity}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: `AOS_ID: ${id}` });
        
                const FinishedLoggingchannel = client.channels.cache.get('1206357891821604904'); 
                FinishedLoggingchannel.send({ embeds: [CompletedEmbed] });
                interaction.editReply({ embeds: [CompletedEmbed], components: [] });
            }
        });
        
        mainCollector.on('end', () => {
            console.log('AOS Collector End')
        });
        
    }
};